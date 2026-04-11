# 🛠️ Liquibase Veri Ekleme Sorunu — Tanı ve Çözüm Rehberi
> **Ortam:** PostgreSQL + Docker + Liquibase

---

## 📋 İçindekiler

1. [Contexts & Labels Sorunu](#1-contexts--labels-sorunu)
2. [Preconditions Sorunu](#2-preconditions-ön-koşul-sorunu)
3. [Checksum (MD5) Uyuşmazlığı](#3-checksum-md5-uyuşmazlığı)
4. [Docker Volume & Senkronizasyon Sorunu](#4-docker-volume--senkronizasyon-sorunu)
5. [Genel Tanı Akışı](#-genel-tanı-akışı)

---

## 1. Contexts & Labels Sorunu

Bu sorun, changeset'lerin **sessizce atlanmasına** neden olan en yaygın hatalardan biridir.

> ⚠️ Liquibase bir changeset üzerinde `context` tanımlıysa ve sen bunu çalıştırma anında belirtmezsen, o changeset **hiçbir hata vermeden geçilir.**

### Nasıl Tespit Edilir?

Changelog dosyandaki her changeset başlığını incele. Eğer şuna benzer bir tanım varsa sorunun kaynağı burasıdır:

```
context="production"
context="seed"
```

### Çözüm Yolları

- Liquibase çalıştırırken `--contexts=production` parametresini ekle
- Context kullanmak istemiyorsan, changeset'ten o satırı **tamamen kaldır**
- Docker Compose üzerinden çalışıyorsan environment variable olarak tanımla:

```
LIQUIBASE_COMMAND_CONTEXTS=production
```

- `DATABASECHANGELOG` tablosundaki `CONTEXTS` sütununa bakarak hangi changeset'lerin hangi context ile kaydedildiğini kontrol et

---

## 2. Preconditions (Ön Koşul) Sorunu

Precondition'lar, bir changeset'in çalışıp çalışmayacağını belirleyen koşullardır. Eğer bu koşullar sağlanmazsa ve `onFail` değeri yanlış ayarlanmışsa, changeset sessizce atlanır ya da başarılı gibi işaretlenir.

### `onFail` Değerleri ve Anlamları

| Değer | Davranış |
|---|---|
| `HALT` | İşlemi tamamen durdurur, hata fırlatır |
| `CONTINUE` | Changeset'i atlar, bir sonrakine geçer — **log'a bile yazmaz** |
| `MARK_RAN` | Changeset'i çalıştırmadan başarılı sayar, `DATABASECHANGELOG`'a yazar |
| `WARN` | Uyarı verir ama devam eder |

### Kritik Durum

> 🔴 Eğer `onFail="MARK_RAN"` kullanılıyorsa, Liquibase o changeset'i gerçekte **hiç çalıştırmadan** tabloya "başarılı" olarak kaydeder. Build başarılı görünür ama veri yoktur.

### Tanı Adımları

1. `DATABASECHANGELOG` tablosunda ilgili changeset'in `EXECTYPE` sütununa bak
2. Eğer değer `MARK_RAN` ise → precondition sağlanmamış demektir
3. Precondition koşulunu kaldırarak ya da `onFail="HALT"` yaparak gerçek hatayı gün yüzüne çıkar

---

## 3. Checksum (MD5) Uyuşmazlığı

Liquibase, her changeset'i ilk çalıştırışta **MD5 hash değerini** `DATABASECHANGELOG` tablosuna kaydeder. Changelog dosyasında o changeset'in içeriği sonradan değiştirilmişse, bir sonraki çalıştırmada hash uyuşmazlığı hatası alırsın.

### Belirtiler

- Build başarılı gibi görünür ama yeni veri gelmez
- Log'da `Validation Failed` veya `checksum mismatch` ifadesi geçer
- `DATABASECHANGELOG` tablosunda `MD5SUM` sütununda eski hash değeri durur

### Çözüm Seçenekleri

| Yöntem | Açıklama | Risk |
|---|---|---|
| `liquibase clearCheckSums` | Tüm hash değerlerini sıfırlar | Tüm changeset'ler yeniden doğrulanır |
| Satırı `DELETE` ile sil | Tek changeset için `DATABASECHANGELOG`'dan sil, tekrar çalıştır | Düşük |
| Yeni changeset ekle | Mevcut changeset'i düzenleme, yeni bir tane oluştur | **En güvenli yol** |

> ✅ **Uzun vadeli kural:** Bir kez çalıştırılmış changeset'leri **asla düzenleme.** Bunun yerine her zaman yeni bir changeset ekle.

---

## 4. Docker Volume & Senkronizasyon Sorunu

Docker ortamında en sinsi sorunlardan biri, verinin konteynere yazılıyor gibi görünmesi ama **volume mapping'in doğru yapılandırılmamış olması** nedeniyle kalıcı hale gelmemesidir.

### Kontrol Edilmesi Gereken Noktalar

**① Volume tanımı eksik veya yanlış olabilir**

Docker Compose dosyanda PostgreSQL servisi için bir `volumes` satırı olmalı ve bu satır, konteynerdeki `/var/lib/postgresql/data` yolunu bir host dizinine ya da adlandırılmış volume'a bağlamalıdır.

---

**② Liquibase ve PostgreSQL farklı ağlarda olabilir**

Her iki servis de aynı `network` altında tanımlı olmazsa, Liquibase veritabanına bağlanıyor gibi görünse de gerçekte yanlış bir hedefe yazıyor olabilir.

---

**③ Konteyner her başladığında veri sıfırlanıyor olabilir**

Eğer PostgreSQL için named volume yerine **anonim volume** kullanılıyorsa, konteyner yeniden başlatıldığında tüm veri silinir.

---

**④ Bağlantı URL'si yanlış olabilir**

Liquibase'in `url` parametresinde `localhost` yerine **Docker servis adı** kullanılmalıdır.

```
# ❌ Yanlış
jdbc:postgresql://localhost:5432/dbname

# ✅ Doğru
jdbc:postgresql://postgres:5432/dbname
```

---

## 🔍 Genel Tanı Akışı

Sorunun kaynağını sistematik olarak bulmak için aşağıdaki sırayı takip et:

```
DATABASECHANGELOG → EXECTYPE sütununu kontrol et
        │
        ├── MARK_RAN → Precondition sorununa odaklan
        │
        ├── Satır YOK → Changeset hiç çalışmamış → Context kontrolü yap
        │
        ├── Logda "checksum" var → clearCheckSums ile sıfırla
        │
        └── Hepsi temiz → Docker volume & network konfigürasyonunu gözden geçir
```

| Adım | Kontrol | Araç |
|---|---|---|
| 1 | `EXECTYPE` sütununu incele | SQL sorgusu |
| 2 | `MARK_RAN` varsa precondition'ı kaldır | Changelog düzenleme |
| 3 | Satır yoksa context parametresini ekle | CLI / Env var |
| 4 | Checksum hatası varsa hash'leri sıfırla | `liquibase clearCheckSums` |
| 5 | Docker volume ve network'ü doğrula | `docker inspect` / Compose dosyası |

---

> 💡 **İpucu:** Sorun giderme sırasında Liquibase log seviyesini `--log-level=DEBUG` olarak ayarlarsan, hangi changeset'lerin neden atlandığını çok daha net görebilirsin.

---

## 🔴 Liquibase Çalışmama Sorunu - Tespit Edilen Problemler ve Çözümler

### Problem 1: PostgreSQL'de `pgvector` Uzantısı Eksik

**Sorun:** `001-initial-schema.xml` dosyasında `vector` uzantısı ve `ai_schema` kullanılıyor, ancak PostgreSQL'de bu uzantı yüklü değil.

**Çözüm:** `docker-compose.yml`'i güncelledim:
```yaml
postgres:
  image: pgvector/pgvector:0.8.2-pg16-bookworm  # PostgreSQL yerine pgvector imajı
  command: ["postgres", "-c", "shared_preload_libraries=vector"]
```

**Not:** Uzantıyı manuel olarak oluşturman gerekebilir:
```bash
docker exec school_db psql -U postgres -d school_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

---

### Problem 2: `onFail="MARK_RAN"` Kullanımı

**Sorun:** Tüm changeset'lerde `onFail="MARK_RAN"` kullanılıyor. Bu, precondition sağlanmadığında changeset çalışmadan "başarılı" olarak işaretlenir.

**Çözüm:** Tüm changeset'lerde `onFail="MARK_RAN"` → `onFail="HALT"` olarak değiştirildi.

**Dosyalar:**
- `backend/src/main/resources/db/changelog/changesets/001-initial-schema.xml`
- `backend/src/main/resources/db/changelog/changesets/002-seed-data.xml`

---

### Problem 3: Liquibase Log Seviyesi

**Çözüm:** Log seviyesi `DEBUG` olarak değiştirildi:
```properties
logging.level.liquibase=DEBUG
```

---

### Test Etmek İçin

1. PostgreSQL'i yeniden başlat (tüm volume'leri silerek):
   ```bash
   docker compose down -v && docker compose up -d
   ```

2. Uzantıyı manuel yükle:
   ```bash
   docker exec school_db psql -U postgres -d school_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
   ```

3. Spring Boot uygulamasını çalıştır:
   ```bash
   cd backend && mvn spring-boot:run
   ```

4. `DATABASECHANGELOG` tablosunu kontrol et:
   ```bash
   docker exec school_db psql -U postgres -d school_db -c "SELECT id, author, exectype, description FROM databasechangelog;"
   ```