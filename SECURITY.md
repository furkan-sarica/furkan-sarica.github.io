# Güvenlik politikası

Güvenlik düzeltmeleri yalnız `main` dalındaki güncel sürüme uygulanır.

Bir açık fark edersen GitHub'ın [özel güvenlik bildirimi](https://github.com/furkan-sarica/furkan-sarica.github.io/security/advisories/new) özelliği açıksa onu kullan. Özellik kapalıysa `sarica.furkan@icloud.com` adresine bildir. Açığı veya sırları herkese açık issue/PR içinde paylaşma.

Bildirimde etkilenen URL/dosya, tekrar üretme adımları ve etkiyi belirt. Gerçek kullanıcı verisi, erişim anahtarı veya parola gönderme. İnceleme ve çözüm için sabit süre garantisi verilmez.

Frontend ve bu public depo sır içermemelidir. API anahtarları backend/proxy tarafında tutulmalıdır. Açığa çıkan anahtar varsa ilgili sağlayıcıdan iptal edilip yenilenmelidir.

CI; Gitleaks, varlık bütünlüğü, JavaScript syntax ve Chromium smoke kontrolleri çalıştırır. Bunlar bütün güvenlik açıklarını veya tarayıcı davranışlarını kapsayan bir sertifikasyon değildir.
