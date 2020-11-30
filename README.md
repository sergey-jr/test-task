## HOW TO

1. Setup python (with pip) version >= 3.7 (recommended add to PATH)
2. Setup node.js
3. Run backend:
    ```
    pip install -r requirements.txt
    python manage.py makemigrations
   python manage.py makemigrations api 
    python manage.py migrate
    python manage.py runserver
   ```
4. Run frontend. Open in other shell(bash)
    ```
   cd frontend
   npm install
   npm start
   ```
4. Backend will work on localhost:8000, frontend - on localhost:3000