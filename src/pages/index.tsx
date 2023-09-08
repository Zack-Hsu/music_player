import Base from "@/elements/templates/Base";
import {useEffect, useRef, useState} from "react";
import ZackPlaylist from "@/elements/chunks/playlist/ZackPlaylist";

export default function Home() {
    const [nowPlaying, setNowPlaying] = useState<number>(0);
    const [playList, setPlayList] = useState(ZackPlaylist);
    const [audioData, setAudioData] = useState(playList[nowPlaying]);
    const [player, setPlayer] = useState<HTMLAudioElement>();
    const controlTime = (dir = "+") => {
        if (!player) return;
        var currentTime = player?.currentTime;
        if (dir == "+") {
            currentTime += 5;
        } else {
            currentTime -= 5;
        }
        player.currentTime = currentTime;
    };
    const PlayOrPause = () => {
        if (!player) return;
        if (player.paused == true || player.currentTime == 0) {
            player.play(); // 开始播放音频
        } else {
            player.pause(); // 暂停音频
        }
    };
    const keyboardControl = (e: any) => {
        //按下空白
        if (e.keyCode === 32) {
            PlayOrPause();
        } else if (e.keyCode === 39) {
            controlTime("+");
        } else if (e.keyCode === 37) {
            controlTime("-");
        }
    };
    const handleLoad = () => {
        document.body.addEventListener("keyup", keyboardControl);
    };

    useEffect(() => {
        handleLoad();
        return () => {
            document.body.removeEventListener("keyup", keyboardControl);
            let music = {
                audioSrc: audioData.audioSrc,
                currentTime: player ? player.currentTime : 0,
            };
            localStorage.music = JSON.stringify(music);
        };
    }, [player]);

    useEffect(() => {
        setAudioData(playList[nowPlaying]);
    }, [nowPlaying]);

    useEffect(() => {
        setPlayer(document.querySelector("#audio-target") as HTMLAudioElement);
    }, []);
    return (
        <Base>
            <div style={{padding: "2rem"}}>
                <div className="row justify-content-center align-items-center card" style={{boxShadow: "4px 6px 6px 2px #adadad"}}>
                    <div className="col-12 text-center">
                        <MusicList
                            name={audioData.name}
                            playlist={playList}
                            setNowPlaying={(idx: number) => {
                                setNowPlaying(idx);
                            }}
                        />
                    </div>
                    <div className="col-12">
                        <img src={`${audioData.audioSrc}${audioData.musicPic}`} alt="" width="100%" height="auto" />
                    </div>
                    <div className="w-100 text-center">
                        <h6 className="text-secondary mt-3">{audioData.name}</h6>
                        <div className="btn-group bg-light">
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => {
                                    setNowPlaying(nowPlaying - 1 <= 0 ? 0 : nowPlaying - 1);
                                }}
                            >
                                <i className="fa-solid fa-backward-step" />
                            </button>
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => {
                                    controlTime("-");
                                }}
                            >
                                <i className="fa-solid fa-backward" />
                            </button>
                            <audio id="audio-target" autoPlay controls src={`${audioData.audioSrc}${audioData.musicFile}`}>
                                <source src={`${audioData.audioSrc}${audioData.musicFile}`} type="audio/mpeg" />
                            </audio>
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => {
                                    controlTime("+");
                                }}
                            >
                                <i className="fa-solid fa-forward" />
                            </button>
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => {
                                    setNowPlaying(nowPlaying + 1 >= playList.length ? 0 : nowPlaying + 1);
                                }}
                            >
                                <i className="fa-solid fa-forward-step" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Base>
    );
}

function MusicList(props: any) {
    const [active, setActive] = useState<boolean>(false);
    return (
        <div className="dropdown">
            <a
                className="w-100 btn btn-light dropdown-toggle"
                onClick={() => {
                    setActive(!active);
                }}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="fa-solid fa-music text-secondary" /> {props.name || "PlayList"}
            </a>
            <ul className={`w-100 dropdown-menu ${active ? "show" : ""}`}>
                {props.playlist.map((itm: any, i: number) => {
                    return (
                        <li key={i}>
                            <a
                                className="dropdown-item"
                                onClick={() => {
                                    props.setNowPlaying(i);
                                }}
                            >
                                {itm.name}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
