document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const filters = document.querySelectorAll('.chip-btn');

    const projects = [
        {
            id: 1,
            title: 'Assistente Virtual',
            tech: 'python',
            cat: 'python',
            img: 'transferir.jpg',
            repo: 'https://github.com/WesleyS08/EI_assistente_virtual',
            demo: '#',
            desc: 'O EI Assistente Virtual é um assistente pessoal virtual desenvolvido em Python, projetado para simplificar sua vida digital. Utilizando tecnologias avançadas de IA e integração com serviços do seu sistema, ele oferece uma ampla gama de funcionalidades, organização e produtividade'
        },
        {
            id: 2,
            title: 'Sistema de Emprego',
            tech: 'PHP • HTML • JS • CSS',
            cat: 'php web',
            img: 'Sistema_de_Emprego.jpg',
            repo: 'https://github.com/WesleyS08/Sistema_de_Emprego',
            demo: '#',
            desc: 'Desenvolvimento de um Sistema de Emprego como parte de um projeto acadêmico, visando não apenas obter uma boa nota, mas também para aprimorar e aplicar os conhecimentos adquiridos durante o curso..'
        },
        {
            id: 3,
            title: 'BioLink Hub',
            tech: 'CSS • JS • HTML',
            cat: 'web',
            img: 'BioLink Hub.jpg',
            repo: 'https://github.com/WesleyS08/BioLinkHub',
            demo: '#',
            desc: 'O BioLinkHub é uma ferramenta criada para simplificar e centralizar a gestão de links bio. Com o aumento da importância das redes sociais e da presença online, é fundamental ter uma forma eficiente de compartilhar várias informações e recursos importantes em um único local acessível.'
        },
        {
            id: 4,
            title: 'Abas-interativas',
            tech: 'CSS • JS • HTML',
            cat: 'web',
            img: 'Abas-interativas.jpg',
            repo: 'https://github.com/WesleyS08/Abas-interativas',
            demo: '#',
            desc: 'Interface com navegação por abas para estudo de componentes UI modernos.'
        },
        {
            id: 5,
            title: 'EcoSocket',
            tech: 'C++',
            cat: 'cpp',
            img: 'EcoSocket.jpg',
            repo: 'https://github.com/WesleyS08/EcoSocket',
            demo: '#',
            desc: 'O EcoSocket: automação para internet ininterrupta. Utiliza tomadas e ESP32 para reiniciar o modem em falhas. Estabilidade e confiança na sua conexão'
        },
        {
            id: 6,
            title: 'RemotePC Power Control',
            tech: 'C++',
            cat: 'cpp',
            img: 'default.jpg',
            repo: 'https://github.com/WesleyS08/RemotePC-Power-Control',
            demo: '#',
            desc: 'O RemotePC-Power-Control é um projeto que utiliza um ESP32 para controlar remotamente o acionamento de um PC via Wake-on-LAN (WOL) e MQTT. Através desse sistema, é possível enviar comandos para ligar o PC remotamente a partir de qualquer dispositivo que tenha acesso ao servidor MQTT configurado.'
        },
        {
            id: 7,
            title: 'API previsão do tempo',
            tech: 'CSS • JS • HTML',
            cat: 'web',
            img: 'API_previsao_do_tempo.jpg',
            repo: 'https://github.com/WesleyS08/API_previsao_do_tempo',
            demo: '#',
            desc: 'Aplicação web consumindo API de clima com interface responsiva.'
        },
        {
            id: 8,
            title: 'Remote Weather Monitor',
            tech: 'C++',
            cat: 'cpp',
            img: 'Remote-Weather-Monito.jpg',
            repo: 'https://github.com/WesleyS08/Remote-Weather-Monito',
            demo: '#',
            desc: 'Estação meteorológica remota com ESP32 e sensor DHT22.'
        },
        {
            id: 9,
            title: 'Ligacao_com_banco',
            tech: 'PHP • HTML',
            cat: 'php',
            img: 'Ligacao_com_banco.jpg',
            repo: 'https://github.com/WesleyS08/Ligacao_com_banco',
            demo: '#',
            desc: 'Projeto para conexão com banco de dados utilizando PHP.'
        },
        {
            id: 10,
            title: 'SensorSync',
            tech: 'C++ • Java',
            cat: 'cpp java',
            img: 'SensorSync.jpg',
            repo: 'https://github.com/WesleyS08/SensorSync',
            demo: '#',
            desc: 'Monitoramento de presença via ESP32 e MQTT.'
        },
        {
            id: 11,
            title: 'Controle de Despesas Pessoais',
            tech: 'Typescript • JavaScript',
            cat: 'typescript javascript',
            img: 'default.jpg',
            repo: 'https://github.com/WesleyS08/DespesasApp',
            demo: '#',
            desc: 'Crontole de Despeesas Pessoais é uma um Aplicativo móvel, desenvolvido em React Native com Expo que permite ao usuário registrar, categorizar e monitorar suas despesas de forma simples e eficiente. Ele interga-se com um Bot do Telegram e Supabase, oferecendo um sistema automatizado para registrar despesas a parti de mensagens enviadas em um Bot.'
        },
        {
            id: 12,
            title: 'Roteiro de Viagem Automático',
            tech: 'JavaScript',
            cat: 'javascript',
            img: 'App-de-Viagem.jpg',
            repo: 'https://github.com/WesleyS08/App-de-Viagem',
            demo: '#',
            desc: 'Geração automática de roteiros turísticos com IA.'
        },
        {
            id: 13,
            title: 'SALV',
            tech: 'Python',
            cat: 'python',
            img: 'SALV.jpg',
            repo: 'https://github.com/WesleyS08/SALV',
            demo: '#',
            desc: 'Sistema inteligente de segurança laboratorial com visão computacional e IoT.'
        }
    ]


    // Injetar cards com flip
    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.category = p.cat;
        card.innerHTML = `
            <div class="card-inner">
                <!-- FRENTE -->
                <div class="card-front">
                    <div class="mockup">
                        <img src="src/assets/portfolio/${p.img}" alt="${p.title}" loading="lazy">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${p.title}</h3>
                        <p class="card-tech">${p.tech}</p>
                        <div class="card-links">
                            <a href="${p.repo}" target="_blank" class="repo">Repositório</a>
                            <button class="details-btn demo">Ver Detalhes</button>
                        </div>
                    </div>
                </div>

                <!-- VERSO -->
                <div class="card-back">
                    <h3 class="back-title">${p.title}</h3>
                    <p class="back-desc">${p.desc}</p>
                    <p class="back-tech">${p.tech}</p>
                    <div class="back-links">
                        <button class="back-btn">Voltar</button>
                        <a href="${p.repo}" target="_blank" class="repo">Repositório</a>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);

        // Eventos de flip
        const detailsBtn = card.querySelector('.details-btn');
        const backBtn = card.querySelector('.back-btn');

        detailsBtn.addEventListener('click', () => {
            card.classList.add('flipped');
        });

        backBtn.addEventListener('click', () => {
            card.classList.remove('flipped');
        });
    });

    // Filtro (igual antes)
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            grid.querySelectorAll('.project-card').forEach(card => {
                const cats = card.dataset.category.split(' ');
                if (filter === 'all' || cats.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.classList.remove('visible');
                    card.classList.remove('flipped'); // fecha flip
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // Animação ao rolar
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.project-card').forEach(card => observer.observe(card));
});