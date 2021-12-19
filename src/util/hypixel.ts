import axios from "axios";

interface IPlayer {
  playername: string;
  uuid: string;
}

export function getPlayer(key: string, uuid: string): Promise<IPlayer | null> {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.hypixel.net/player?key=${key}&uuid=${uuid}`)
      .then((res) => {
        resolve(res.data?.player ?? null);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
