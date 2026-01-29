# Subir el proyecto a GitHub (cuando lo descargaste, no clonaste)

Como descargaste el proyecto (ZIP) y no lo clonaste, no tenés historial de Git ni conexión con ningún repo. Seguí estos pasos.

---

## Paso 1: Crear el repositorio en GitHub

1. Entrá a **https://github.com/new**
2. **Repository name:** por ejemplo `LODO-map` o `lodo-agrotech`
3. Elegí **Public**
4. **No** marques "Add a README" ni ".gitignore" (el proyecto ya los tiene)
5. Clic en **Create repository**
6. Copiá la URL del repo (ej: `https://github.com/TU-USUARIO/LODO-map.git`)

---

## Paso 2: Inicializar Git y hacer el primer commit (en tu PC)

Abrí una terminal en la carpeta del proyecto (`LODO-main`) y ejecutá:

```bash
cd "C:\Users\Usuario\Desktop\LODO-main"

git init
git add .
git commit -m "feat: proyecto LODO Map - backend Go, frontend React, auth, mapa"
git branch -M main
```

---

## Paso 3: Conectar con GitHub y subir

Reemplazá `TU-USUARIO/TU-REPO` por tu usuario y nombre del repo:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Si GitHub te pide usuario y contraseña, usá un **Personal Access Token** (Settings → Developer settings → Personal access tokens) como contraseña.

---

## Paso 4: A partir de ahora, usar el flujo normal

Para nuevos cambios:

1. Crear rama: `git checkout -b feature/nombre`
2. Trabajar, luego: `git add .` y `git commit -m "feat: descripción"`
3. Subir rama: `git push -u origin feature/nombre`
4. En GitHub: abrir **Pull Request** de esa rama hacia `main`
5. Cuando pase el CI, hacer **Merge**

Así seguís el flujo del [README principal](./README.md).
