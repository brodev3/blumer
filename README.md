# blumer

<p>
      <img src="https://i.ibb.co/3sHQCSp/av.jpg" >
</p>

<p >
   <img src="https://img.shields.io/badge/build-v_1.0-brightgreen?label=Version" alt="Version">
</p>


## About

Automatically collect rewards and start farming !

Proxy **ONLY SOCKS5**  supported

## Setup

1. Node JS
2. Clone the repository to your disk
3. In the **scr** folder, change the name of the ```config_ex.json``` on ```config.json```
4. Launch the console (for example, Windows PowerShell)
5. Specify the working directory where you have uploaded the repository in the console using the CD command
    ```
    cd C:\Program Files\blumer
    ```
6. Install packages
   
    ```
    npm install
    ```
7. Use ```import.js``` to import accounts:
    ```
    node scr/telegram/import
    ```
You need to create an application and get the api_id and api_hash for yours accounts.

Proxy format: ```ip:port:login:pass```

Visit: https://my.telegram.org/

8. To start: 
    ```
    node index
    ```





## License

Project **brodev3**/blumer is distributed under the MIT license.
