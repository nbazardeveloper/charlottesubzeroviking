# Рассылка управляющим компаниям (Charlotte, NC)

Один шаблон письма → управляющие компании (property management) → просьба добавить нас в Preferred Vendor List.
Отправка: `info@bestsubzerovikingservices.com` через Zoho (SMTP/IMAP, тариф Mail Lite).
Учёт: Google Sheet с вкладками **Leads**, **Sent Log**, **Replies**.

## Файлы
| Файл | Что это |
|---|---|
| `template.html`, `template.txt` | Письмо в «личном» стиле (HTML + текст), используется по умолчанию. `template-newsletter.html` — дизайнерская версия (уходит в «Промоакции»), включается через `"html_template"` в config.json. Подстановки: `{{greeting}}`, `{{company}}`, `{{site}}` |
| `send_outreach.py` | Отправка писем со статусом `New` |
| `check_replies.py` | Сбор ответов/отказов/bounce в таблицу |
| `config.json` | Настройки (ID таблицы, лимиты, серверы Zoho). Шаблон — `config.example.json` |
| `.env` | Пароль приложения Zoho. Шаблон — `.env.example`. **Не коммитится** |
| `service_account.json` | Ключ Google сервисного аккаунта. **Не коммитится** |

Фото для письма лежат в `public/images/email/` сайта и грузятся с https://subzerovikingcharlotte.com/images/email/… — **они появятся только после деплоя сайта.**

## Установка (один раз)
```bash
cd outreach
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # впишите ZOHO_APP_PASSWORD
```

### Google Sheet + сервисный аккаунт
1. console.cloud.google.com → создать проект → APIs & Services → Library → включить **Google Sheets API**.
2. IAM & Admin → Service Accounts → Create → Keys → Add key → JSON → сохранить как `outreach/service_account.json`.
3. Создать пустую Google Таблицу «PM Outreach – Charlotte», нажать «Поделиться» и дать доступ **Редактор** на email сервисного аккаунта (вида `…@….iam.gserviceaccount.com`).
4. ID таблицы (часть URL между `/d/` и `/edit`) вписать в `config.json` → `sheet_id`.
5. `python send_outreach.py --init` — создаст вкладки и заголовки.

## Работа
```bash
python send_outreach.py --preview              # preview.html — как выглядит письмо
python send_outreach.py --dry-run              # кому уйдёт сегодня, без отправки
python send_outreach.py --test you@gmail.com   # пачка писем себе, таблица не меняется
python send_outreach.py                        # реальная отправка (до daily_limit в день)
python check_replies.py                        # раз в день: ответы и bounce → таблица
```

## Вкладка Leads
`Company | Contact Name | Title | Email | Website | Phone | City | Type | Source | Vendor Portal URL | Status | Sent Date | Reply Date | Notes`

Статусы:
- `New` — готов к отправке (ставите при добавлении компании)
- `Sent` — письмо ушло (ставит скрипт)
- `Replied` — пришёл ответ (ставит check_replies)
- `Interested` / `Vendor registered` / `Not interested` — ставите вручную после прочтения ответа
- `Bounced` — адрес не существует (ставит скрипт)
- `Do not contact` — попросили не писать (ставит скрипт по слову «unsubscribe»; можно вручную)
- `Vendor portal` — у компании регистрация подрядчиков через форму/портал, письмо не шлём

Правила: одна компания (один домен email) получает письмо один раз; адреса без MX-записи пропускаются.

## Темп
- Неделя 1: `daily_limit` = 10, неделя 2: 20, дальше 30–40.
- Между письмами пауза 60–180 сек — скрипт отправки работает долго, это нормально.
- Перед стартом в Zoho Admin → Domains → Email Configuration должны быть зелёные SPF и DKIM.
