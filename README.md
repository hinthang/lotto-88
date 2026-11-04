# เลขเด็ด 88 🎱

เว็บแอปสถิติและตรวจหวย **หวยรัฐบาลไทย · สลาก N3 · หวยลาว** สร้างบน Google Apps Script ใช้ Google Sheets เป็นฐานข้อมูล

![ตัวอย่าง](docs/screenshots/celebrations.png)

## ฟีเจอร์
- **ผลหวยย้อนหลัง** หวยไทย 10 ปี (ตั้งแต่ 2559) · หวยลาวตั้งแต่ 2560 · สลาก N3 ตั้งแต่งวดแรก 1 พ.ย. 2567
- **อัปเดตอัตโนมัติ** วันหวยออกเริ่ม 16:00 น. แล้วดึงซ้ำทุก 15 นาทีจนครบทุกรางวัล (API กองสลาก) · เงินรางวัล N3 จากข่าวไทยรัฐ · หวยลาวทุกวัน 21:00 น.
- **ตรวจรางวัล** ครบทุกรางวัล พร้อมหน้าฉลองเต็มจอตามระดับรางวัล
- **สุ่มเลข · เลขเด็ด · สถิติ** (ความถี่, ไม่ออกนาน, เลขวิ่ง, โต๊ด, ผลย้อนหลังของสูตร)
- **เลขที่ซื้อ** บันทึกพร้อมจำนวนใบ (เข้ารหัสในชีต) · ตรวจให้อัตโนมัติ · จับคู่งวดเลื่อน ±3 วัน · วิเคราะห์ "ควรตามเลขเดิมไหม"
- **สรุปเงิน** งบต่อเดือน กราฟซื้อ vs ได้คืน รายเดือน/รายปี/รายหวย
- **สมาชิก** สมัคร + ผู้ดูแลอนุมัติ · รหัสผ่านแฮชแบบมี salt
- **LINE Messaging API** แจ้งผล · เตือนก่อนหวยออก · พิมพ์คำสั่งในแชท (`357846 x2`, `เลขเด็ด`, `งบ` …)

> ทุกเลขมีโอกาสออกเท่ากันทุกงวด สถิติและเลขเด็ดใช้ช่วยตัดสินใจและคุมงบเท่านั้น

## โครงสร้าง
```
src/          โค้ดที่ขึ้น Apps Script (Code.gs, Index.html, appsscript.json)
data/         ข้อมูลผลย้อนหลังต้นฉบับ (ฝังอยู่ใน Code.gs แล้ว)
test/         ทดสอบฝั่งเซิร์ฟเวอร์ด้วย Node (จำลอง SpreadsheetApp ฯลฯ)
docs/         ภาพหน้าจอ และรูปโปรไฟล์ LINE OA
```

## ติดตั้งครั้งแรก (แบบคัดลอกวาง)
1. สร้าง Google Sheet ใหม่ → Extensions > Apps Script
2. วาง `src/Code.gs` ลงในไฟล์ Code.gs และสร้างไฟล์ HTML ชื่อ `Index` วาง `src/Index.html`
3. Project Settings → ติ๊ก *Show "appsscript.json"* แล้ววาง `src/appsscript.json` (เขตเวลา Asia/Bangkok)
4. เลือกฟังก์ชัน `setup` → Run (อนุญาตสิทธิ์) — สร้างชีตและตั้งทริกเกอร์ทั้งหมด
5. Deploy → New deployment → Web app · Execute as **Me** · Who has access **Anyone**
6. เปิดลิงก์เว็บ → สมัครคนแรก = ผู้ดูแลอัตโนมัติ

ทุกครั้งที่แก้โค้ด: **Deploy > Manage deployments > แก้ไข > New version** (ลิงก์เดิมใช้ต่อได้) · ถ้าแก้ทริกเกอร์ให้รัน `setup()` ใหม่

## แก้บน GitHub แล้ว deploy อัตโนมัติ (GitHub Actions)
ทุกครั้งที่แก้ไฟล์ใน `src/` บน branch `main` → `.github/workflows/deploy.yml` จะทดสอบ → `clasp push` → อัปเดต deployment เดิม (ลิงก์ `/exec` ไม่เปลี่ยน)

ตั้งค่าครั้งเดียว — Settings > Secrets and variables > Actions > New repository secret:

| Secret | ค่า |
|---|---|
| `CLASPRC_JSON` | เนื้อหาไฟล์ `~/.clasprc.json` หลัง `clasp login` |
| `SCRIPT_ID` | Apps Script > Project Settings > Script ID |
| `DEPLOYMENT_ID` | รหัส `AKfycb…` ในลิงก์เว็บ `…/macros/s/<รหัส>/exec` |

> หลังเปิดใช้ ให้แก้โค้ดที่ GitHub เท่านั้น — ที่แก้ในหน้า Apps Script จะถูกเขียนทับรอบถัดไป
> ถ้าเปลี่ยนเรื่องทริกเกอร์ ยังต้องรัน `setup()` ในหน้า Apps Script เอง

## ซิงก์จากเครื่องด้วย clasp (ทางเลือก)
```bash
npm install                      # ติดตั้ง clasp
npx clasp login                  # ล็อกอิน Google ครั้งเดียว
cp .clasp.json.example .clasp.json   # แล้วใส่ scriptId ของโปรเจกต์
npx clasp pull                   # (ครั้งแรก) ดึงโค้ดล่าสุดจาก Apps Script มาเทียบ
npm run push                     # ส่งโค้ดใน src/ ขึ้น Apps Script
```
แล้ว Deploy เวอร์ชันใหม่จากหน้า Apps Script (หรือ `npx clasp deploy -i <deploymentId>` เพื่อคงลิงก์เดิม)

> ต้องเปิด Google Apps Script API ก่อนที่ https://script.google.com/home/usersettings

## ทดสอบ
```bash
npm test     # รันทดสอบฝั่งเซิร์ฟเวอร์: N3, ควรตามเลข, คำสั่ง LINE, ทริกเกอร์วันหวยออก
```

## ตั้งค่า LINE (ไม่บังคับ)
1. สร้าง LINE Official Account + เปิด Messaging API ใน LINE Developers
2. ออก **Channel access token (long-lived)**
3. ในเว็บ แท็บผู้ดูแล → ตั้งค่า LINE → วาง token และลิงก์เพิ่มเพื่อน
4. ตั้ง Webhook URL = ลิงก์เว็บแอป (`…/exec`) แล้วเปิด Use webhook
5. สมาชิกกด "เชื่อม LINE" ในเว็บ แล้วส่งรหัส 8 หลักให้บอท

รูปโปรไฟล์บอทอยู่ใน `docs/line-oa/`

## ความปลอดภัย
- **ห้าม commit token / secret ใดๆ** — LINE token เก็บใน Script Properties ผ่านหน้าเว็บเท่านั้น ไม่อยู่ในโค้ด
- `.clasp.json` และ `.clasprc.json` อยู่ใน `.gitignore` แล้ว
- ข้อมูลสมาชิกและเลขที่ซื้ออยู่ใน Google Sheet ไม่ได้อยู่ใน repo
- แนะนำตั้ง repo เป็น **Private**

## แหล่งข้อมูล
กองสลากกินแบ่งรัฐบาล (API ตรวจผล) · Sanook / Raakaadee (หวยลาว) · ไทยรัฐ (เงินรางวัล N3)
