<!-----

You have some errors, warnings, or alerts. If you are using reckless mode, turn it off to see inline alerts.
* ERRORs: 0
* WARNINGs: 0
* ALERTS: 7

Conversion time: 1.449 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β34
* Thu Apr 20 2023 02:09:23 GMT-0700 (PDT)
* Source doc: Integrazione Bazme - Shelly
* This document has images: check for >>>>>  gd2md-html alert:  inline image link in generated source and store images to your server. NOTE: Images in exported zip file from Google Docs may not appear in  the same order as they do in your doc. Please check the images!

----->


<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 0; ALERTS: 7.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>
<a href="#gdcalert2">alert2</a>
<a href="#gdcalert3">alert3</a>
<a href="#gdcalert4">alert4</a>
<a href="#gdcalert5">alert5</a>
<a href="#gdcalert6">alert6</a>
<a href="#gdcalert7">alert7</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>


**Keyless**

Questo documento descrive l’integrazione tra l’applicazione BazMe e i device Shelly con lo scopo di dare la possibilità di accesso ad apparati con elettroserrature 12v o 220v.

Il device Shelly1 Plus d’ora in poi denominato Shelly può essere alimentato sia con una tensione di 12v oppure con una tensione  a 220v.

Lo Shelly permette possiede un rele a 220v al suo interno azionabile attraverso dei comandi esterni. Questi comandi possono essere inviati utilizzando una serie di protocolli, quali: HTTP, RPC, WebSocket, MQTT e UDP.

In questo progetto utilizzeremo l’interfaccia RPC con un device Shelly1 Plus (Fig.1).



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")


Fig. 1

Per eseguire un reset di fabbrica del device basta premere per 10 secondi il pulsante sul retro del device.

Il reset comporterà la perdita di tutte le configurazioni e il device verrà riportato allo stato iniziale.

**Installazione Hardware**

Lo Shelly ha due possibilità di alimentazione 220v o 12v 

Il collegamento va effettuato di conseguenza seguendo uno dei seguenti schemi:



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")


In questo schema si possono vedere i collegamenti dei carichi da effettuare sui pin O e I a sinistra dello Shelly.



**Installazione Software**

Lo Shelly crea un hotspot WiFi denominato ShellyPlus1-XXXXXXXXXXXX. 

La parte XXXXXXXXXXX dipende dal numero di serie ad esempio ShellyPlus1-7C87CE720AD8.

Per effettuare la configurazione nell’App BazMe seguire i seguenti passi:



1. Collegarsi alla rete WiFi creata dallo Shelly (ShellyPlus1-XXXXXXXXXXXX) con il telefono.
2. Selezionare l’entità a cui si vuole aggiungere il device (es.: Condominio Via Maffucci).
3. Premere il pulsante** Configura Nuovo Device**.
4. Al termine della configurazione verrà creato un nuovo Device nell'elenco come in Fig. 2.



<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image3.jpg). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image3.jpg "image_tooltip")


 Fig. 2

Per effettuare un test di funzionamento cliccare il nuovo device creato e premere **‘Apri’**.

**Configurazione punto di accesso WiFi**

Il device possiede un DHCP interno ed assegnerà un ip a chiunque si colleghi al suo WiFi che al momento dell’installazione è open e senza password.

L’ip del device sarà sempre **192.168.3.1**.

Ne consegue che dovremmo proteggere sia l’accesso al WiFi che ai relativi comandi.

Iniziamo con la configurazione della password del WiFi.



* **Settaggio password di protezione su WiFi AP (Access Point)**

    **[WiFi.SetConfig](http://IPDEVICE/rpc/WiFi.SetConfig?config={"ap":{"ssid":"ShellyPlus1-7C87CE720AD8","pass":"NuovaPassword","enable":true)**


Questo comando assegna una password (**NuovaPassword**) alla rete WiFi creata dal device e va lanciato come primo comando subito dopo la connessione alla sua rete Wifi.


```
http://192.168.33.1/rpc/WiFi.SetConfig?config={"ap":{"ssid":"ShellyPlus1-7C87CE720AD8","pass":"NuovaPassword","enable":true}}
```


Il comando è** WiFi.SetConfig** a cui viene passato un json contenente vari parametri tra cui la password. Qui sotto i vari parametri possibili.



<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image4.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image4.png "image_tooltip")


Il parametro SSID rappresenta il punto di accesso WiFi che si vuole configurare.

Il parametro PASS è la password da settare.

Il parametro ENABLE deve essere impostato a true.

**Configurazione accesso ai comandi del device**

Il device espone dei comandi che permettono di utilizzare i servizi offerti dallo Shelly.

Per proteggere tutti i comandi è necessario proteggere con una password il loro utilizzo.

L’ip del device sarà sempre **192.168.3.1**.



* **Settaggio Password di protezione comandi**

    **<span style="text-decoration:underline;">Shelly.SetAuth</span>**




<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image5.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image5.png "image_tooltip")


Parametri:



* **user**: Deve sempre essere **admin**
* **realm**: Nome del device che si sta configurando. Es.:SellyPlus1-XXXXXXX
* **ha1**: SHA256 della stringa seguente user:realm:password

In questo esempio viene configurata per il device **shellyplus1-7c87ce720ad8** una password ‘**NuovaPassword’**

Per ottenere il parametro **ha1** avviene calcolato lo SHA256 di una stringa così composta user:realm:password.

Esempio:

**admin:shellyplus1-7c87ce720ad8:NuovaPassword**

Lo sha256 di questa stringa è

**7a89f0e64fac6814c3e5281dd0698532bc93d7d7f20ccf8ae995dcd58c22c8a7**

Il comando da inviare al device per configurare l’accesso ai comandi è il seguente::


```
http://192.168.33.1/rpc/Shelly.SetAuth?user="admin"&realm="shellyplus1-7c87ce720ad8"&ha1="7a89f0e64fac6814c3e5281dd0698532bc93d7d7f20ccf8ae995dcd58c22c8a7"
```




**Azionamento attuatore (relè)**

E’ possibile azionare l'attuatore (relè) all'interno del device per un tempo stabilito.

L’ip del device sarà sempre **192.168.3.1**.



* **Azionamento attuatore per un tempo stabilito**

    **<span style="text-decoration:underline;">Switch.Set</span>**




<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image6.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image6.png "image_tooltip")


Il parametro **ID** rappresenta sempre 0 (zero).

Il parametro **ON** true = acceso, false = spento.

Il parametro **TOGGLE_AFTER** rappresenta il numero di secondi in cui il dispositivo aziona il relè.


```
http://192.168.33.1/rpc/Switch.Set?id=0&on=true&toggle_after=1 
```




**Autenticazione**

L’accesso al comando** Switch.Set** è protetto da un'autenticazione di tipo DIGEST. 

Per comandare il relè del device, sono necessari due passaggi:

La richiesta deve essere una (**GET**) così composta:


```
http://192.168.33.1/rpc/Switch.Set?id=0&on=true&toggle_after=1 
```


Il comando andrà inviato **due volte**.

La **prima** andrà in errore **401 Unauthorized** ma fornirà alcuni parametri necessari alla **seconda** richiesta di autenticazione.

Di seguito un diagramma di funzionamento.



<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image7.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image7.png "image_tooltip")


Dopo la prima richiesta il device fornirà i parametri necessari alla composizione della seconda richiesta.

Per funzionare correttamente la seconda richiesta, è necessario aggiungere un ulteriore oggetto JSON di autenticazione al frame della richiesta.



* `realm`: stringa, identificativo device. Obbligatorio
* `username`: stringa, deve essere sempre _admin_. Obbligatorio
* `nonce`: numero, numero random ottenuto dall’header dalla prima richiesta fallita con errore 401 random . **Obbligatorio**
* `cnonce`: numero, numero random generato dal client. **Obbligatorio**
* `algorithm`: stringa, _SHA-256_. **Obbligatorio**
* `response`: stringa, SHA256 della stringa così composta: 

`&lt;ha1> + ":" + &lt;nonce> + ":" + &lt;nc> + ":" + &lt;cnonce> + ":" + "auth" + ":" + &lt;ha2>` in SHA256. **Obbligatorio**



    * `ha1`: stringa, `&lt;user>:&lt;realm>:&lt;password>` encoded in SHA256
    * `ha2`: stringa, "dummy_method:dummy_uri" encoded in SHA256


```
curl --location 'http://192.168.33.1/rpc/Switch.Set?id=0&on=true&toggle_after=1' \
--header 'Authorization: Digest username="admin", realm="shellyplus1-7c87ce720ad8", nonce="641ed573", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", response="b5c3c6caedc51903d208e352343e9d3d23c9bcb0022abc0b70e0f34405879a7f"'
