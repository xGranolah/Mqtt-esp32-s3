<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import Paho from "paho-mqtt";
import { ref, onMounted } from 'vue'
import iro from '@jaames/iro';
import IconEcosystem from './icons/IconEcosystem.vue';
import IconLogin from './icons/IconLogin.vue';
import IconConsole from './icons/IconConsole.vue';
import IconLight from './icons/IconLight.vue';



// Definicje zmiennych
const host = ref('');
const port = ref('');
const username = ref('');
const password = ref('');
const topic = ref('esp/led');
const logMessages = ref<string[]>([]);

let client: Paho.Client | null = null;
let colorPickerRef: iro.ColorPicker | null = null;


interface ConnectionLostResponse {
  errorCode: number;
}

// Funkcja do rozpoczęcia połączenia MQTT
function startConnect() {
  const clientID = "clientID-" + Math.random().toString(36).substr(2, 9);

  if (!host.value || !port.value) {
    logMessages.value.push("Host lub port są puste. Proszę je uzupełnić.");
    return;
  }

  logMessages.value.push(`Connecting to ${host.value} on port ${port.value}`);
  client = new Paho.Client(host.value, Number(port.value), clientID);

  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  client.connect({
    onSuccess: onConnect,
    userName: username.value,
    password: password.value,
  });
}

// Obsługa utraty połączenia
function onConnectionLost(responseObject: ConnectionLostResponse) {
  logMessages.value.push("ERROR: Stracono połączenie");
  if (responseObject.errorCode !== 0) {
    // Handle the error code here
  }
}

// Obsługa odebrania wiadomości
function onMessageArrived(mqttMessage: globalThis.Paho.MQTT.Message) {
  logMessages.value.push(`Topic: ${mqttMessage.destinationName} | Message: ${mqttMessage.payloadString}`);
}

// Subskrypcja na temat po połączeniu
function onConnect() {
  if (!topic.value) {
    logMessages.value.push("Brak tematu do subskrypcji.");
    return;
  }
  logMessages.value.push(`Subscribing to topic ${topic.value}`);
  client?.subscribe(topic.value);
}

// Publikowanie wiadomości
function publish(message: string) {
  if (!client || !client.isConnected()) {
    logMessages.value.push("Klient nie jest połączony.");
    return;
  }

  if (!message) {
    logMessages.value.push("Wiadomość jest pusta.");
    return;
  }

  const topicName = topic.value || "default/topic";
  client.send(topicName, message);
  logMessages.value.push(`Wiadomość wysłana do tematu ${topicName}`);
}
window.onload = () => {
  const container = document.getElementById("messages");

  // Funkcja do przewijania w dół
  const autoScroll = () => {
    container.scrollTop = container.scrollHeight;
  };

  // Ustawienie automatycznego przewijania co 100ms
  setInterval(autoScroll, 100);
};

// Obsługa logów po zamontowaniu komponentu
onMounted(() => {
  logMessages.value.push("Aplikacja gotowa.");

  // Inicjalizacja kolorowego wybornika
   colorPickerRef = new iro.ColorPicker("#colorPicker", {width: 280, color: "rgb(255, 0, 0)", borderWidth: 1, borderColor: "#fff",});

  // Obsługa zmiany koloru
  if (colorPickerRef) {
    colorPickerRef.on(["color:init", "color:change"], function(color) {
      const hex = color.hexString;
      publish(hex); // Publikowanie aktualnego koloru jako wiadomość MQTT
    });
  }
});
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Opis Projektu</template>

    <p>
      Mamy możliwość dwóch opcji:</p>
      <li><button class="g button3">ON</button>
      odpowiada za załączenie leda na płytce ESP32-S3.</li>
      <li><button class="g button4">OFF</button>odpowiada za wyłączenie leda na płytce ESP32-S3.</li>
      <li>Za pomocą koła kolorów możemy dynamicznie zmieniać kolory diody led.</li>
  </WelcomeItem>

  <WelcomeItem>
  <template #icon>
    <IconLogin />
  </template>
  <template #heading>Narzędzia</template>

  <div class="input-container">
    <div class="form-group">
      <input
        id="host"
        v-model="host"
        placeholder="Adres IP"
        class="input-field"
      />
    </div>
    <div class="form-group">
      <input
        id="port"
        v-model="port"
        type="number"
        placeholder="Port"
        min="0"
        max="65535"
        class="input-field"
      />
    </div>
    <div class="form-group">
      <input
        id="username"
        v-model="username"
        placeholder="Użytkownik"
        class="input-field"
      />
    </div>
    <div class="form-group">
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Hasło"
        class="input-field"
      />
    </div>
    <button class="connect-button" @click="startConnect">Połącz</button>
  </div>
</WelcomeItem>


  <WelcomeItem>
    <template #icon>
      <IconConsole/>
    </template>
        <!-- Wyświetlanie wiadomości -->
        <div id="messages">
      <div v-for="message in logMessages" :key="message">{{ message }}</div>
        </div>
  </WelcomeItem>


    <WelcomeItem>
    <template #icon>
      <IconLight />
    </template>
    <template #heading>Przyciski funkcyjne</template>

    <!-- Przyciski ON/OFF -->
    <div class="button-container">
      <button class="button button1" @click="publish('1')" role="button">ON</button>
      <button class="button button2" @click="publish('0')" role="button">OFF</button>
    </div>
    </WelcomeItem>

    <WelcomeItem>
    <template #icon>
      <IconEcosystem />
    </template>

    <template #heading>Koło kolorów</template>

    <!-- Kolorowy wybornik -->
    <div id="colorPicker"></div>
  </WelcomeItem>

</template>
