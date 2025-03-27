function searchWallpapers() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const wallpapers = document.querySelectorAll(".wallpaper");
    wallpapers.forEach(wallpaper => {
        const img = wallpaper.querySelector("img");
        console.log("Image src:", img.src, "Alt text:", img.alt);
        if (input === "") {
            wallpaper.style.display = "block";
        } else {
            const altText = img.alt.toLowerCase();
            wallpaper.style.display = altText.includes(input) ? "block" : "none";
        }
    });
}

function checkFileExists(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr.status === 200);
        }
    };
    xhr.send();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", () => {
    const terminalOutput = document.getElementById("terminal-output");
    const terminalInput = document.getElementById("terminal-input");
    const micBtn = document.getElementById("mic-btn");
    const speakBtn = document.getElementById("speak-btn");
    const totalDownloadsElement = document.getElementById("total-downloads");
    const liveUsersElement = document.getElementById("live-users");
    const activeUsersElement = document.getElementById("active-users");

    const commands = {
        "whoami": "root",
        "date": new Date().toString(),
        "pwd": "/root",
        "ls": "dir1 dir2 file1 file2 nmap metasploit aircrack-ng",
        "uname -r": "5.15.0-kali1-amd64",
        "cat /etc/os-release": 'PRETTY_NAME="Kali GNU/Linux Rolling"',
        "uptime": "14:30:00 up 1 day, 2:15, 1 user",
        "df -h": "Filesystem Size Used Avail Use% Mounted on /dev/sda1 50G 20G 30G 40% /",
        "free -h": "Mem: 8G 2G 6G 25%",
        "top": "(Simulated) top - 14:30:00 up 1 day, 2:15, 1 user",
        "nmap localhost": "Starting Nmap 7.91 ( https://nmap.org )\nNmap scan report for localhost (127.0.0.1)\nPORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\nNmap done: 1 IP address scanned in 0.03 seconds",
        "nmap 192.168.1.1": `Starting Nmap 7.91 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nPORT   STATE SERVICE\n${getRandomInt(20, 1000)}/tcp open  unknown\nNmap done: 1 IP address scanned in 0.05 seconds`,
        "metasploit": "msf6 > show options\n[*] Starting Metasploit Framework console...\n[*] Use 'set RHOSTS <target>' to configure target",
        "aircrack-ng": "Aircrack-ng 1.6\n[*] Usage: aircrack-ng <options> <file>\n[*] Example: aircrack-ng -b 00:11:22:33:44:55 capture.cap",
        "hydra": "Hydra v9.2\n[*] Example: hydra -l admin -P passwords.txt ssh://192.168.1.1\n[*] Use -t for tasks, -V for verbose output",
        "sqlmap": "sqlmap/1.5.10\n[*] Example: sqlmap -u 'http://target.com?id=1' --dbs\n[*] Starting SQL injection scan...",
        "dirb http://localhost": "DIRB v2.22\n[+] URL: http://localhost\n[+] Found: /admin /login /config\n[*] Scan completed in 0.02 seconds",
        "nikto -h localhost": "Nikto v2.1.6\n[+] Target: localhost\n[+] + Server: Apache/2.4.41\n[+] + /admin/: Admin page found\n[*] Scan completed",
        "wireshark": "[*] Wireshark simulation: Capturing on 'eth0'\n[*] 10 packets captured\n[*] Use 'tshark' for CLI packet analysis",
        "john": "John the Ripper 1.9.0\n[*] Example: john --wordlist=passwords.txt hash.txt\n[*] Cracking MD5 hashes...",
        "hashcat": "hashcat 6.2.5\n[*] Example: hashcat -m 0 -a 0 hash.txt wordlist.txt\n[*] Starting hash cracking...",
        "dir": "dir1 dir2 file1 file2 (Windows dir)",
        "cls": "",
        "ver": "Microsoft Windows [Version 10.0.19045]",
        "ipconfig": "IPv4 Address: 192.168.1.100",
        "ping 8.8.8.8": "Reply from 8.8.8.8: bytes=32 time=10ms TTL=117",
        "netstat -an": "TCP 0.0.0.0:80 0.0.0.0:0 LISTENING",
        "tasklist": "cmd.exe 1234 Console 1 5,000 K",
        "systeminfo": "OS Name: Microsoft Windows 10 Pro",
        "echo %USERNAME%": "Admin",
        "time": "The current time is: 14:30:00.00"
    };

    let commandHistory = [];
    let historyIndex = -1;

    document.querySelector(".terminal-window").addEventListener("click", () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener("input", () => {
        const commandText = document.getElementById("command-text");
        if (commandText) {
            commandText.textContent = terminalInput.value;
        }
    });

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && terminalInput.value.trim() !== "") {
            const cmd = terminalInput.value.trim().toLowerCase();
            executeCommand(cmd);
            terminalInput.value = "";
            const commandText = document.getElementById("command-text");
            if (commandText) {
                commandText.textContent = "";
            }
            historyIndex = commandHistory.length;
        } else if (e.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex].command;
                const commandText = document.getElementById("command-text");
                if (commandText) {
                    commandText.textContent = terminalInput.value;
                }
            }
        } else if (e.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex].command;
                const commandText = document.getElementById("command-text");
                if (commandText) {
                    commandText.textContent = terminalInput.value;
                }
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = "";
                const commandText = document.getElementById("command-text");
                if (commandText) {
                    commandText.textContent = "";
                }
            }
        }
    });

    const executeCommand = (cmd) => {
        let output = commands[cmd] || "Command not found";
        commandHistory.push({ command: cmd, output: output });
        if (commandHistory.length > 10) {
            commandHistory = commandHistory.slice(-10);
        }
        if (cmd === "cls") {
            commandHistory = [];
            terminalOutput.innerHTML = `root@kali:~$ <span id="command-text"></span><span id="cursor">█</span>`;
        } else {
            terminalOutput.innerHTML = "";
            commandHistory.forEach(entry => {
                terminalOutput.innerHTML += `root@kali:~$ ${entry.command}<br>${entry.output}<br>`;
            });
            terminalOutput.innerHTML += `root@kali:~$ <span id="command-text"></span><span id="cursor">█</span>`;
        }
        terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
        if ("speechSynthesis" in window && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(cmd);
            utterance.onerror = () => {
                console.error("Speech synthesis failed");
                alert("Text-to-speech failed. Please try again.");
            };
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Text-to-speech not supported in this browser");
            alert("Text-to-speech is not supported in this browser.");
        }
        terminalInput.focus();
    };

    if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        micBtn.addEventListener("click", () => {
            try {
                recognition.start();
                micBtn.style.background = "#00C4B4";
                micBtn.style.borderColor = "#00DDEB";
            } catch (error) {
                console.error("Speech recognition start failed:", error);
                alert("Failed to start speech recognition. Please check your microphone and browser permissions.");
                micBtn.style.background = "#415a77";
                micBtn.style.borderColor = "#00C4B4";
            }
        });

        recognition.onresult = (event) => {
            const spokenCommand = event.results[0][0].transcript.trim().toLowerCase();
            terminalInput.value = spokenCommand;
            executeCommand(spokenCommand);
            micBtn.style.background = "#415a77";
            micBtn.style.borderColor = "#00C4B4";
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === "no-speech") {
                alert("No speech detected. Please speak clearly and try again.");
            } else if (event.error === "audio-capture") {
                alert("Microphone not found or access denied. Please check your microphone settings.");
            } else {
                alert("Speech recognition failed: " + event.error);
            }
            micBtn.style.background = "#415a77";
            micBtn.style.borderColor = "#00C4B4";
        };

        recognition.onend = () => {
            micBtn.style.background = "#415a77";
            micBtn.style.borderColor = "#00C4B4";
        };
    } else {
        micBtn.style.display = "none";
        console.warn("Speech recognition not supported in this browser");
        alert("Speech recognition is not supported in this browser. Please use a supported browser like Chrome.");
    }

    speakBtn.addEventListener("click", () => {
        const lastCommandEntry = commandHistory[commandHistory.length - 1];
        const lastCommand = lastCommandEntry ? lastCommandEntry.command : "No command to read";
        if ("speechSynthesis" in window && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(lastCommand);
            utterance.onerror = () => {
                console.error("Speech synthesis failed");
                alert("Text-to-speech failed. Please try again.");
            };
            window.speechSynthesis.speak(utterance);
            speakBtn.style.background = "#00C4B4";
            speakBtn.style.borderColor = "#00DDEB";
            utterance.onend = () => {
                speakBtn.style.background = "#415a77";
                speakBtn.style.borderColor = "#00C4B4";
            };
        } else {
            console.warn("Text-to-speech not supported in this browser");
            alert("Text-to-speech is not supported in this browser.");
        }
    });

    let totalDownloads = parseInt(totalDownloadsElement.textContent);
    let liveUsers = parseInt(liveUsersElement.textContent);
    let activeUsers = parseInt(activeUsersElement.textContent);

    setInterval(() => {
        totalDownloads += 1;
        totalDownloadsElement.textContent = totalDownloads.toLocaleString();
        liveUsers = getRandomInt(2, 5);
        liveUsersElement.textContent = liveUsers;
        activeUsers = getRandomInt(50, 65);
        activeUsersElement.textContent = activeUsers;
    }, 30000);

    document.querySelectorAll(".download-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const url = btn.getAttribute("href");
            checkFileExists(url, (exists) => {
                if (exists) {
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert("Sorry, this wallpaper is not available at the moment.");
                }
            });
        });
    });

    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const scrollAmount = getRandomInt(100, 500) * (Math.random() < 0.5 ? -1 : 1);
            window.scrollBy({ top: scrollAmount, behavior: "smooth" });
            document.querySelectorAll(".wallpaper").forEach(card => {
                card.style.transform = `rotate(${getRandomInt(-5, 5)}deg)`;
            });
        });
    });

    const tags = document.querySelectorAll(".tag");
    tags.forEach(tag => {
        tag.addEventListener("click", (e) => {
            e.preventDefault();
            const scrollAmount = tag.textContent === "#DarkTheme" ? 300 : getRandomInt(100, 500) * (Math.random() < 0.5 ? -1 : 1);
            window.scrollBy({ top: scrollAmount, behavior: "smooth" });
            document.querySelectorAll(".wallpaper").forEach(card => {
                card.style.transform = `rotate(${getRandomInt(-5, 5)}deg)`;
                setTimeout(() => {
                    card.style.transform = "rotate(0deg)";
                }, 1000);
            });
        });
    });

    const cursor = document.querySelector(".custom-cursor");
    const trailCount = 6;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement("div");
        trail.className = "cursor-trail";
        document.body.appendChild(trail);
        trails.push(trail);
    }

    let angle = 0;
    let lastX = 0, lastY = 0;
    let isAnimating = false;

    const animateCursor = (e) => {
        if (!isAnimating) return;
        const x = e.clientX;
        const y = e.clientY;
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";
        angle += 0.02;
        trails.forEach((trail, index) => {
            const radius = 15 + index * 8;
            const trailAngle = angle + index * (2 * Math.PI / trailCount);
            const offsetX = Math.cos(trailAngle) * radius + 20 * Math.sin(angle + index);
            const offsetY = Math.sin(trailAngle) * radius + 20 * Math.cos(angle + index);
            trail.style.left = (x + offsetX) + "px";
            trail.style.top = (y + offsetY) + "px";
            trail.style.opacity = 0.4 - (index * 0.05);
            trail.style.transform = `scale(${0.8 - index * 0.1})`;
        });
        lastX = x;
        lastY = y;
        requestAnimationFrame(() => animateCursor(e));
    };

    document.addEventListener("mousemove", (e) => {
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(() => animateCursor(e));
        }
    });

    document.addEventListener("mousedown", (e) => {
        const ripple = document.createElement("div");
        ripple.className = "ripple";
        ripple.style.left = e.clientX + "px";
        ripple.style.top = e.clientY + "px";
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1200);

        const shockwave = document.createElement("div");
        shockwave.className = "shockwave";
        shockwave.style.left = e.clientX + "px";
        shockwave.style.top = e.clientY + "px";
        document.body.appendChild(shockwave);
        setTimeout(() => shockwave.remove(), 1500);

        for (let i = 0; i < 10; i++) {
            const spark = document.createElement("div");
            spark.className = "spark";
            spark.style.left = e.clientX + "px";
            spark.style.top = e.clientY + "px";
            spark.style.setProperty("--tx", getRandomInt(-30, 30) + "px");
            spark.style.setProperty("--ty", getRandomInt(-30, 30) + "px");
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 800);
        }

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = e.clientX + "px";
            particle.style.top = e.clientY + "px";
            const angle = (2 * Math.PI * i) / 12;
            const distance = 40;
            const tx = distance * Math.cos(angle);
            const ty = distance * Math.sin(angle);
            particle.style.setProperty("--tx", tx + "px");
            particle.style.setProperty("--ty", ty + "px");
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    });

    const wallpapers = document.querySelectorAll(".wallpaper");
    wallpapers.forEach(wallpaper => {
        wallpaper.addEventListener("mousedown", (e) => {
            const rect = wallpaper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement("div");
            ripple.className = "wallpaper-ripple";
            ripple.style.left = x + "px";
            ripple.style.top = y + "px";
            wallpaper.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);

            for (let i = 0; i < 6; i++) {
                const particle = document.createElement("div");
                particle.className = "wallpaper-particle";
                particle.style.left = x + "px";
                particle.style.top = y + "px";
                const angle = (2 * Math.PI * i) / 6;
                const distance = 20;
                const tx = distance * Math.cos(angle);
                const ty = distance * Math.sin(angle);
                particle.style.setProperty("--tx", tx + "px");
                particle.style.setProperty("--ty", ty + "px");
                wallpaper.appendChild(particle);
                setTimeout(() => particle.remove(), 800);
            }
        });

        wallpaper.addEventListener("mousemove", (e) => {
            const rect = wallpaper.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (y / rect.height) * 15;
            const rotateY = -(x / rect.width) * 15;
            wallpaper.querySelector("img").style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        wallpaper.addEventListener("mouseleave", () => {
            wallpaper.querySelector("img").style.transform = "rotateX(0deg) rotateY(0deg)";
        });
    });

    const interactiveElements = document.querySelectorAll(".nav-btn, .tag, .wallpaper, .download-btn, .speech-controls button");
    interactiveElements.forEach(element => {
        element.addEventListener("mousemove", (e) => {
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement("div");
                particle.className = "hover-particle";
                particle.style.left = e.clientX + "px";
                particle.style.top = e.clientY + "px";
                particle.style.setProperty("--tx", getRandomInt(-15, 15) + "px");
                particle.style.setProperty("--ty", getRandomInt(-15, 15) + "px");
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 600);
            }
        });
    });

    terminalInput.focus();
});