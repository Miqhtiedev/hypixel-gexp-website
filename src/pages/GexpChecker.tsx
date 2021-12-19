import { FunctionComponent, useEffect, useState } from "react";
import TextField from "../components/TextField";
import { ExclamationCircleIcon, HomeIcon, XIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { BarLoader, ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import axios, { AxiosResponse } from "axios";

interface IGuildMember {
  uuid: string;
  rank: string;
  joined: number;
  questParticipation: number;
  expHistory: { [key: string]: number };
}

const onlyDigitRegex = new RegExp("^[0-9]+$");

const GexpChecker: FunctionComponent = () => {
  const [apiKey, setApiKey] = useState("");
  const [minimumGexp, setMinimumGexp] = useState("");
  const [guildName, setGuildName] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [gexpMap, setGexpMap] = useState(new Map<string, number>());

  useEffect(() => {
    if (apiKey && minimumGexp && guildName) {
      setButtonDisabled(false);
    } else setButtonDisabled(true);
  }, [apiKey, minimumGexp, guildName]);

  function handleGexpUpdate(value: string) {
    if (value === "" || onlyDigitRegex.test(value)) setMinimumGexp(value);
  }

  function handleButtonClick() {
    if (buttonDisabled) return;
    setLoading(true);

    axios
      .get(`https://api.hypixel.net/guild?key=${apiKey}&name=${guildName}`)
      .then(async (res) => {
        if (!res.data.guild) {
          setLoading(false);
          setErrorMessage("Invalid Guild Name");
        }

        console.log(res.data.guild);
        const members: IGuildMember[] = res.data.guild.members;

        const belowRequiredGexp: Map<string, number> = new Map();
        members.forEach((member) => {
          let weeklyGexp = 0;
          for (const key in member.expHistory) {
            weeklyGexp += member.expHistory[key];
          }

          if (weeklyGexp < parseInt(minimumGexp)) {
            belowRequiredGexp.set(member.uuid, weeklyGexp);
          }
        });

        const promises: Promise<AxiosResponse<any, any>>[] = [];
        belowRequiredGexp.forEach((xp, uuid) => {
          promises.push(axios.get(`https://api.minetools.eu/uuid/${uuid}`));
        });

        const nameMap: Map<string, number> = new Map();
        Promise.all(promises).then((histories) => {
          histories.forEach((history) => {
            nameMap.set(history.data.name, belowRequiredGexp.get(history.data.id)!);
          });

          setGexpMap(nameMap);
          setLoading(false);
        });
      })
      .catch((err) => {
        setLoading(false);
        setErrorMessage(err.response.status === 403 ? "Invalid API Key" : err.response.statusText);
      });
  }

  if (gexpMap.size > 0) {
    return (
      <div className="flex flex-col h-[95vh] w-[40vw] ml-[30vw]"> 
        <div className="shrink basis-auto">
          <button onClick={() => setGexpMap(new Map())} className="animatedGrowButton w-[100px] h-[40px] bg-red-800 text-black rounded-md mb-4">Reset</button>
          <h1 className="text-white">{gexpMap.size} people below {minimumGexp}gexp</h1>
        </div>
        <div className="border-white border-2 rounded-md flex-shrink w-full flex flex-col">
        <div className="flex flex-row h-[25px] border-b-2 border-white">
          <div className="basis-[40%] border-white border-r-2 text-white flex justify-center">Name</div>
          <div className="basis-[30%] border-white border-r-2 text-white flex justify-center">Current GEXP</div>
          <div className="basis-[30%] border-white border-r-2 text-white flex justify-center">Required GEXP</div>
        </div>

          {Array.from(gexpMap.keys()).map((key) => {
            console.log(key);

            const gexp = gexpMap.get(key)!;
            return (
              <div className="flex flex-row h-[100px] border-b-2 border-white">
                <div className="basis-[40%] border-white border-r-2 flex items-center justify-center text-white"><img className="h-[50px] w-[50px]" src={`https://mc-heads.net/avatar/${key}`}/>&nbsp;{key}</div>
                <div className="basis-[30%] border-white border-r-2 flex items-center justify-center text-green-600">{gexp}</div>
                <div className="basis-[30%] border-white border-r-2 flex items-center justify-center text-red-600"><span className="text-gray-600">+</span>{parseInt(minimumGexp) - gexp}</div>            
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (!loading)
    return (
      <div className="center">
        <div className="flex flex-col justify-center items-center mb-28">
          <h1 className="text-white block text-4xl sm:text-6xl">GEXP Checker</h1>
          {errorMessage ? (
            <div className="flex-row flex items-center">
              <XIcon
                onClick={() => {
                  setErrorMessage("");
                }}
                color="white"
                className="mt-4 w-[20px] h-[16px] transistion duration-300 delay-100 hover:text-red-500"
              />
              <h2 className="text-red-600 mt-4">{errorMessage}</h2>
            </div>
          ) : (
            ""
          )}
        </div>
        <TextField placeholder="API Key" value={apiKey} valueUpdate={setApiKey} localStorageKey="key" />
        <TextField class="mt-8" placeholder="Minimum GEXP" value={minimumGexp} valueUpdate={handleGexpUpdate} />
        <TextField class="mt-8" placeholder="Guild Name" value={guildName} valueUpdate={setGuildName} />

        <button onClick={handleButtonClick} className={`mt-8 actionButton w-[100px] h-[40px] ${!buttonDisabled ? "bg-sky-400 text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed"}`}>
          Check
        </button>
      </div>
    );
  else
    return (
      <div className="center">
        <BarLoader color="aqua" width="125px" />
      </div>
    );
};

export default GexpChecker;
