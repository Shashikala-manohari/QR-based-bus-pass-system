import { LogBox } from "react-native";
import Tts from "react-native-tts";

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
export function Speak(message:string){
    Tts.setDefaultRate(0.4);
    Tts.setDefaultPitch(1.0);
    Tts.setDefaultLanguage('en-US');
    Tts.speak(message, {
      iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
      rate: 0.5,
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
        KEY_PARAM_VOLUME: 1,
      },
    });
}