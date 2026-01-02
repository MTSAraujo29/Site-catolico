const fallbackVerses = [
    { text: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" },
    { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
    { text: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo.", reference: "Salmos 23:4" },
    { text: "Busca primeiro o Reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", reference: "Mateus 6:33" },
    { text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", reference: "Mateus 11:28" },
    { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", reference: "João 3:16" },
    { text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.", reference: "Salmos 37:5" },
    { text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.", reference: "João 14:27" },
    { text: "Mil cairão ao teu lado, e dez mil à tua direita, mas não chegará a ti.", reference: "Salmos 91:7" },
    { text: "Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.", reference: "Josué 1:9" },
    { text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.", reference: "Provérbios 3:5" },
    { text: "Pois onde estiver o vosso tesouro, aí estará também o vosso coração.", reference: "Lucas 12:34" },
    { text: "Amados, amemo-nos uns aos outros; porque o amor é de Deus; e qualquer que ama é nascido de Deus e conhece a Deus.", reference: "1 João 4:7" },
    { text: "Agrada-te do Senhor, e ele satisfará os desejos do teu coração.", reference: "Salmos 37:4" },
    { text: "Eis que estou à porta, e bato; se alguém ouvir a minha voz, e abrir a porta, entrarei em sua casa, e com ele cearei, e ele comigo.", reference: "Apocalipse 3:20" },
    { text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", reference: "1 Coríntios 13:4" },
    { text: "Vigiai e orai, para que não entreis em tentação; na verdade, o espírito está pronto, mas a carne é fraca.", reference: "Mateus 26:41" },
    { text: "Bem-aventurados os puros de coração, porque eles verão a Deus.", reference: "Mateus 5:8" },
    { text: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.", reference: "Salmos 119:105" },
    { text: "Muitos são os planos no coração do homem, mas o que prevalece é o propósito do Senhor.", reference: "Provérbios 19:21" },
    { text: "Alegrai-vos na esperança, sedes pacientes na tribulação, perseverai na oração.", reference: "Romanos 12:12" },
    { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", reference: "Jeremias 29:11" },
    { text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", reference: "Salmos 46:1" },
    { text: "Se Deus é por nós, quem será contra nós?", reference: "Romanos 8:31" },
    { text: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.", reference: "Filipenses 4:7" },
    { text: "Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.", reference: "Mateus 7:7" },
    { text: "Nisto todos conhecerão que sois meus discípulos, se vos amardes uns aos outros.", reference: "João 13:35" },
    { text: "Antes que te formasse no ventre te conheci, e antes que saísses da madre, te santifiquei; às nações te dei por profeta.", reference: "Jeremias 1:5" },
    { text: "Combati o bom combate, acabei a carreira, guardei a fé.", reference: "2 Timóteo 4:7" },
    { text: "Filho meu, não te esqueças da minha lei, e o teu coração guarde os meus mandamentos.", reference: "Provérbios 3:1" },
    { text: "Em todo o tempo ama o amigo e para a hora da angústia nasce o irmão.", reference: "Provérbios 17:17" }
];

document.addEventListener("DOMContentLoaded", () => {
    loadDailyVerse();
});

async function loadDailyVerse() {
    const today = new Date().toDateString(); // "Tue Dec 30 2025" - Unique per day

    // Check local storage
    const savedDate = localStorage.getItem('verseDate');
    const savedVerseData = localStorage.getItem('verseData'); // Storing the full object now

    if (savedDate === today && savedVerseData) {
        // 1. Same day? Use saved verse.
        console.log("Returning saved verse for today.");
        const verse = JSON.parse(savedVerseData);
        displayVerse(verse);
    } else {
        // 2. New day? Fetch new one.
        console.log("New day. Fetching new verse...");

        try {
            // Try fetching from API
            const verse = await fetchInfoFromApi();
            saveAndDisplay(today, verse);
        } catch (error) {
            console.error("API failed. Using fallback.", error);
            // Fallback: Pick random from local array
            const randomFallback = fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];
            saveAndDisplay(today, randomFallback);
        }
    }
}

async function fetchInfoFromApi() {
    // Using ABíbliaDigital API (NVI version)
    const response = await fetch('https://www.abibliadigital.com.br/api/verses/nvi/random');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    // Format the API response to our internal format
    return {
        text: data.text,
        reference: `${data.book.name} ${data.chapter}:${data.number}`
    };
}

function saveAndDisplay(date, verse) {
    localStorage.setItem('verseDate', date);
    localStorage.setItem('verseData', JSON.stringify(verse));
    displayVerse(verse);
}

function displayVerse(verse) {
    const textElement = document.getElementById('verse-text');
    const refElement = document.getElementById('verse-reference');

    // Simple opacity transition
    textElement.style.opacity = 0;
    refElement.style.opacity = 0;

    setTimeout(() => {
        textElement.innerText = `"${verse.text}"`;
        refElement.innerText = verse.reference;

        textElement.classList.remove('loading-text');

        textElement.style.opacity = 1;
        refElement.style.opacity = 1;
    }, 300);
}
