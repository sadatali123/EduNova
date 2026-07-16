 # LMS Frontend

 ### Setup instruction

1. Clone the Project

 ```
    git clone https://github.com/sadatali123/EduNova
 ```

2. Move into the directory

 ```
 cd Client
 ```

 3. install dependencies

 ```
  npm install
```

4.Run the project

```
npm run dev
```

### Setup instruction for Tailwind 

[From official Documentation]
(https://tailwindcss.com/docs/installation/using-vite)

1. Install Tailwind CSS

```
npm install -D tailwindcss@3
```

2. Create your tailwind.config.js file.

```
npx tailwindcss init
```

3. Add the paths to tailwind.config.js

```
content: ["./src/**/*.{html,js,jsx,ts,tsx}"]
```

4. Add the Tailwind directives to  index.css
 ```
 @tailwind base;
 @tailwind components;
 @tailwind utilities;
 ```