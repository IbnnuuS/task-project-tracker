# 🤖 AI Usage Transparency

Dokumen ini dibuat sebagai bentuk transparansi penggunaan AI dalam pengerjaan technical test ini.

---

## 1. AI Tools yang Digunakan

| Tool                            | Peran                                                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Google Gemini (Antigravity)** | Agentic AI coding assistant utama yang digunakan dalam VS Code untuk membantu seluruh proses development via pair programming |

> Antigravity adalah agentic AI coding assistant berbasis Google Gemini yang terintegrasi langsung di dalam VS Code. AI ini dapat membaca, menulis, dan membuat file, serta menjalankan terminal command secara langsung di lingkungan developer.

---

## 2. MCP (Model Context Protocol) yang Digunakan

Tidak ada MCP eksternal tambahan yang digunakan. Semua interaksi dilakukan langsung melalui antarmuka Antigravity di VS Code, yang sudah memiliki tools bawaan seperti:

- `view_file` & `write_to_file` — membaca dan menulis file
- `run_command` — menjalankan perintah terminal
- `browser_subagent` — membuka browser dan verifikasi tampilan UI secara otomatis
- `grep_search` & `find_by_name` — mencari kode di dalam project

---

## 3. Daftar Prompt yang Digunakan

Berikut ini adalah rangkuman prompt/instruksi yang diberikan kepada AI selama pengerjaan technical test:

### Fase Setup & Debugging Awal

```
Saya sedang mengerjakan technical test untuk posisi Junior Fullstack Web Developer.

Tolong bantu saya membuat aplikasi "Task & Project Tracker" dengan stack berikut:

Backend:
- Laravel 12
- PHP >= 8.2
- PostgreSQL
- Laravel Sanctum (Personal Access Token)
- Migration wajib
- Seeder wajib

Frontend:
- Vue.js 3
- TypeScript
- Composition API
- Axios untuk komunikasi API
- State management menggunakan Pinia

Struktur project menggunakan konsep MONOREPO:
- backend/
- frontend/

Fitur yang harus dibuat:

AUTHENTICATION
- Login menggunakan email dan password
- Menggunakan Laravel Sanctum Personal Access Token
- Logout revoke token
- Tidak ada register endpoint
- User admin dibuat melalui Seeder

PROJECT MANAGEMENT
Project memiliki field:
- id
- name
- description
- status (active / archived)
- created_at
- updated_at

Fitur:
- Create project
- Read project
- Update project
- Tidak ada delete project
- Searching project berdasarkan judul

Pada halaman project detail:
- Menampilkan task dalam bentuk card
- Task bisa dipindahkan antar category
- Bisa tambah task
- Bisa edit project

TASK MANAGEMENT

Task memiliki field:
- id
- project_id
- title
- description
- due_date
- category_id
- deleted_at
- deleted_by

Fitur:
- Create task
- Read task per project
- Read task global
- Update task
- Delete task menggunakan soft delete
- Searching task berdasarkan judul

Category berasal dari Seeder.

DASHBOARD

Dashboard harus menampilkan:
- Total project aktif
- Total task belum selesai
- Daftar task yang mendekati due date

TESTING

Backend:
- Minimal 1 test menggunakan PHPUnit

Frontend:
- Minimal 1 test menggunakan Vitest / Vue Test Utils

API DOCUMENTATION

Buat dokumentasi API menggunakan:
- Swagger (OpenAPI)
atau
- Postman collection yang bisa diexport

FRONTEND STRUCTURE

Gunakan struktur berikut:

src/
  components/
  views/
  routes/
  stores/
  services/
  types/
  plugins/
main.ts

Axios harus dibuat dalam layer services.

Error handling:
- Validasi harus menampilkan pesan per field
- Tidak boleh hanya "Error 500"

Tambahan:

Buatkan juga:

1. Struktur folder project lengkap
2. Daftar migration
3. Daftar API endpoint
4. Desain database
5. Seeder contoh data
6. Flow login Sanctum
7. Struktur frontend
8. Contoh implementasi axios service
9. Contoh implementasi authentication store
10. Contoh unit test backend
11. Contoh unit test frontend
```

### Fase Integrasi Template Admin

```
baik sudah bagus, sekarang saya mau menerapkan template admin pada folder template.
jadi di dalam folder frontend semuanya harus menggunakan template yaitu di folder template admin.
untuk tech stack nya tetap dan tidak berubah, yang berubah hanya UIUX templatenya aja.
```

### Fase Penambahan Fitur

```
pada http://localhost:5176/projects/1 terdapat card todo, in progres, dan done itu bisa ditambahkan
2 lagi yaitu testing dan pending. Jadi urutannya adalah todo, in progres, testing, done, dan pending
```

```
pada http://localhost:5173/projects/1 setelah menambahkan tugas atau add task, saya mau jangan
pakai titik tiga di card tersebut, langsung tampilkan saja tombol edit dan hapus
```

```
pada http://localhost:5173/projects saat membuat project baru atau new project, tambahkan isian
due date dan saat edit juga sama tambahkan due datenya juga
```

### Fase Debugging

```
[plugin:vite:vue] Invalid end tag.
D:/Latihan/code/Task & Project Tracker/frontend/src/views/ProjectDetailView.vue:193:11
```

### Fase Dashboard

```
pada Tracker Activity | Today ubah menjadi Task mendekati Due Date saja
```

### Fase Dokumentasi

```
Buatkan README.md untuk project Laravel + Vue monorepo.
Isi README harus mencakup:
- Deskripsi project
- Tech stack
- Cara install project
- Cara setup database PostgreSQL
- Cara menjalankan migration dan seeder
- Cara menjalankan backend
- Cara menjalankan frontend
- Cara menjalankan testing
- Cara melihat dokumentasi API
- Struktur folder project

Gunakan format markdown yang rapi untuk GitHub.
```

```
Buatkan file AI_USAGE.md untuk technical test.
Isi file harus menjelaskan:
1. AI tools yang digunakan
2. MCP yang digunakan (jika ada)
3. Daftar prompt yang digunakan
4. Penjelasan bagaimana AI membantu proses development
```

---

## 4. Bagaimana AI Membantu Proses Development

AI digunakan sebagai **pair programmer aktif**, bukan hanya sebagai generator kode. Berikut kontribusinya selama development:

### 🏗️ Perencanaan & Desain

- Membuat **implementation plan** sebelum melakukan perubahan besar (misal: integrasi template NiceAdmin)
- Menganalisis struktur project yang sudah ada sebelum membuat keputusan teknis
- Merancang arsitektur fitur baru (misalnya: due date di Projects)

### 💻 Penulisan Kode

- Mengintegrasikan template **NiceAdmin** ke seluruh komponen Vue (Login, Dashboard, Projects, Project Detail, Global Tasks)
- Menambahkan kolom **Testing** dan **Pending** ke Kanban board, termasuk migrasi database dan seeder
- Menambahkan fitur **due date** untuk Projects di backend (migrasi, model, controller) dan frontend (form, display, badge)
- Mengganti tiga-titik dropdown di task card dengan tombol **edit** dan **delete** langsung

### 🐛 Debugging & Enhancements

- Mendiagnosis error `[plugin:vite:vue] Invalid end tag` dan menemukan tag `</span>` yang berlebih.
- Menambahkan **descriptive error handling** berupa Alert UI merah di seluruh halaman Vue (Projects, Detail, Tasks) alih-alih hanya mengandalkan logging console, memastikan notifikasi error jelas per-field sesuai requirement.
- Mengatur konfigurasi `tsconfig.app.json` terkait Path Aliases (`@/*`) untuk memastikan sistem TypeScript membaca struktur project Vue dengan sempurna tanpa error IDE.
- Membuat `docker-compose.yml` serta Dockerfile untuk Backend dan Frontend dari awal guna mengakomodasi instruksi fitur bonus.

### ✅ Verifikasi

- Memastikan sinkronisasi `line-clamp` untuk text truncation di UI Card.
- Menggunakan browser environment untuk verifikasi perbaikan error message.
- Mengkonfirmasi bahwa fungsi Soft Delete berjalan persis sesuai dengan instruksi yang ditetapkan (`deleted_by` tercatat).

### 📄 Dokumentasi

- Membuat `README.md` yang komprehensif dengan semua instruksi setup
- Membuat dokumen ini (`AI_USAGE.md`) untuk transparansi

---

## ⚠️ Catatan Penting

Meskipun AI membantu secara signifikan dalam proses ini, seluruh keputusan arsitektur dan review kode tetap dilakukan oleh developer. AI bertindak sebagai alat bantu yang mempercepat implementasi, bukan pengganti pemahaman teknis developer.

---

_Dokumen ini dibuat pada: 6 Maret 2026_
