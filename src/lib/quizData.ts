
import { QuizQuestion, ProfilesData } from "./quizTypes";

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Cum reacționezi când clientul cere \"să fie ieftin și repede\"?",
    answers: [
      {
        text: "Explic în detaliu de ce calitatea nu poate fi compromisă și ofer alternative.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Accept provocarea și găsesc soluții rapide care respectă bugetul.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Propun soluții inteligente cu tehnologii moderne care economisesc timp și bani.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Folosesc metodele clasice verificate, chiar dacă durează mai mult.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Când lucrezi într-un tablou electric vechi, ce faci prima dată?",
    answers: [
      {
        text: "Fac o schemă a tabloului și verific fiecare circuit metodic.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Schimb rapid componentele care par deteriorate și testez.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Evaluez posibilitatea de modernizare completă cu componente smart.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Păstrez cât mai mult din instalația originală dacă funcționează.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Cât de des testezi instalația cu megohmetrul?",
    answers: [
      {
        text: "La fiecare lucrare nouă și periodic la cele existente, conform normativelor.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Doar când e absolut necesar, pentru a nu pierde timp.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Folosesc echipamente moderne de testare care fac multiple verificări simultan.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Mă bazez pe experiență, testez doar când am dubii serioase.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Ce părere ai despre dispozitivele AFDD (Arc Fault Detection Device)?",
    answers: [
      {
        text: "Esențiale pentru siguranță, le recomand și instalez conform standardelor.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Le instalez doar dacă clientul insistă, altfel prefer soluții mai rapide.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Componente cheie în orice instalație modernă, le integrez în sisteme smart.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Costisitoare și complicate, instalațiile clasice sunt suficient de sigure.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Ce ți se pare mai important: Estetica cablării sau viteza execuției?",
    answers: [
      {
        text: "Estetica și organizarea perfectă a cablurilor, chiar dacă durează mai mult.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Viteza execuției, atâta timp cât funcționează corect și e sigur.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Ambele, folosind soluții moderne de management al cablurilor.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Funcționalitatea primează, estetica e secundară.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Când ai consultat ultima oară un normativ sau ai participat la un curs?",
    answers: [
      {
        text: "Lunar urmăresc actualizările și particip la cursuri pentru certificări.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Mă informez rapid când apare o tehnologie nouă pe care trebuie să o implementez.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Constant, sunt la curent cu toate inovațiile și tendințele din domeniu.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Rar, experiența practică e mai valoroasă decât teoriile noi.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Cum abordezi o cerere de implementare a unui sistem de casă inteligentă?",
    answers: [
      {
        text: "Planific detaliat fiecare aspect și ofer clientului documentație completă.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Propun soluții care se pot implementa rapid și eficient.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Cu entuziasm! Recomand cele mai noi tehnologii și le integrez perfect.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Cu precauție, sugerez doar tehnologii verificate și simple.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Ce faci când întâlnești o problemă tehnică pe care nu o poți rezolva imediat?",
    answers: [
      {
        text: "Cercetez metodic, consult documentația tehnică și găsesc soluția corectă.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Găsesc rapid o soluție alternativă pentru a finaliza lucrarea la timp.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Consult forumuri tehnice și comunități online sau folosesc aplicații specializate.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Mă bazez pe experiență și metode clasice care au funcționat în trecut.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Cum te informezi despre noile produse din domeniul electric?",
    answers: [
      {
        text: "Studiez cataloagele și specificațiile tehnice în detaliu.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Particip la demonstrații practice care arată eficiența produselor.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Urmăresc influenceri din domeniu, canale YouTube specializate și newslettere.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Prefer să folosesc produse cu care am experiență și care s-au dovedit fiabile.",
        type: 4, // Stil Vechi
      },
    ],
  },
  {
    question: "Cum reacționezi când un client îți cere sfaturi pentru economisirea energiei?",
    answers: [
      {
        text: "Ofer o analiză detaliată a consumului și soluții personalizate cu calcule precise.",
        type: 1, // Meșterul Metodic
      },
      {
        text: "Sugerez rapid câteva modificări eficiente care pot fi implementate imediat.",
        type: 2, // Regele Vitezei
      },
      {
        text: "Recomand sisteme smart de monitorizare și control al consumului energetic.",
        type: 3, // Electricianul Smart
      },
      {
        text: "Sfătuiesc metode tradiționale de economisire, verificate în timp.",
        type: 4, // Stil Vechi
      },
    ],
  },
];

export const profilesData: ProfilesData = {
  mesterm: {
    title: "Meșterul Metodic",
    description: "Ești electricianul care nu lasă nimic la voia întâmplării. Planifici meticuloz, respecți standardele, și livrezi lucrări impecabile. Clienții apreciază atenția ta la detalii și profesionalismul desăvârșit.",
    icon: "wrench",
    strengths: [
      "Calitate impecabilă a lucrărilor",
      "Respectarea strictă a normativelor",
      "Documentație completă pentru fiecare proiect"
    ],
    shareText: "Sunt Meșterul Metodic! Planific meticuloz și respect toate standardele. Află ce tip de electrician ești tu!"
  },
  regev: {
    title: "Regele Vitezei",
    description: "Eficiența este cuvântul tău de ordine. Rezolvi rapid și eficient orice problemă, găsind întotdeauna cele mai directe soluții. Clienții te apreciază pentru promptitudine și capacitatea de a respecta termenele strânse.",
    icon: "zap",
    strengths: [
      "Execuție rapidă a proiectelor",
      "Soluții eficiente pentru orice buget",
      "Capacitate excelentă de adaptare la urgențe"
    ],
    shareText: "Sunt Regele Vitezei! Rezolv rapid și eficient orice problemă electrică. Descoperă ce tip de electrician ești tu!"
  },
  smart: {
    title: "Electricianul Smart",
    description: "Ești pionierul tehnologiilor de vârf în domeniul electric. Implementezi soluții inteligente și inovezi constant. Clienții te caută pentru expertiza ta în cele mai noi sisteme și pentru viziunea modernă asupra instalațiilor.",
    icon: "lightbulb",
    strengths: [
      "Expertiză în tehnologii moderne",
      "Integrare perfectă a sistemelor smart",
      "Soluții inovatoare pentru eficiență energetică"
    ],
    shareText: "Sunt Electricianul Smart! Implementez cele mai noi tehnologii în instalații electrice. Descoperă ce tip de electrician ești tu!"
  },
  stilv: {
    title: "Stil Vechi",
    description: "Experiența ta vastă și abordarea tradițională sunt cele mai mari atuuri. Te bazezi pe metode verificate care au trecut testul timpului. Clienții apreciază înțelepciunea ta practică și soluțiile de încredere.",
    icon: "clock",
    strengths: [
      "Experiență solidă și metode verificate",
      "Soluții robuste și de încredere",
      "Cunoștințe practice dobândite în ani de activitate"
    ],
    shareText: "Sunt electrician de Stil Vechi! Mă bazez pe experiență și metode verificate. Află ce tip de electrician ești tu!"
  }
};
