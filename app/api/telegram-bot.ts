import axios from 'axios';
import { TG_API_PATH, TG_CHAT_ID } from '../keys/main';
import { tgBotMethodsKeys } from '../keys/methods';

export class TelegramBot {

  public getUpdates() {
    axios.get(TG_API_PATH + '/update')
    .then(response => {
      console.log(response);
    })
  }

  public sendMessage(message: string): void {
    axios.get(
      `${TG_API_PATH}${tgBotMethodsKeys.SEND_MESSAGE}?chat_id=${TG_CHAT_ID}&text=${message}`
    );
  }
}