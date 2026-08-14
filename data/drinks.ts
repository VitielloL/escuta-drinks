import { Drink } from "@/types/drink";

export const drinks: Drink[] = [
  {
    id: "dry-martini",
    name: "Dry Martini",
    category: "Clássicos",
    garnish: "Zest siciliano ou azeitona",
    method: "Mexido",
    glass: "Taça Nick & Nora",
    ingredients: [
      {
        name: "Beefeater Gin",
        amount: "70",
        unit: "ml",
      },
      {
        name: "Vermute seco Nolly Prat",
        amount: "10",
        unit: "ml",
      },
    ],
    preparation: [
      "Adicione gelo no mixing glass, resfrie e coe.",
      "Adicione todos os ingredientes e mexa por 10 segundos.",
      "Faça a filtragem com auxílio do strainer em uma taça previamente resfriada.",
      "Finalize com zest de limão siciliano ou azeitona no palito.",
    ],
    tags: ["gin", "seco", "clássico", "martini"],
  },

  {
    id: "dirty-martini",
    name: "Dirty Martini",
    category: "Clássicos",
    garnish: "Azeitonas",
    method: "Mexido",
    glass: "Taça Nick & Nora",
    ingredients: [
      {
        name: "Beefeater Gin",
        amount: "60",
        unit: "ml",
      },
      {
        name: "Vermute seco Nolly Prat",
        amount: "10",
        unit: "ml",
      },
      {
        name: "Salmoura de azeitonas",
        amount: "30",
        unit: "ml",
      },
      {
        name: "Solução salina",
        amount: "2",
        unit: "gotas",
      },
    ],
    preparation: [
      "Adicione gelo no mixing glass, resfrie e coe.",
      "Adicione todos os ingredientes e mexa por 10 segundos.",
      "Faça a filtragem com auxílio do strainer em uma taça previamente resfriada.",
      "Finalize com 3 azeitonas no palito.",
    ],
    tags: ["gin", "azeitona", "salino", "martini"],
  },

  {
    id: "amaretto-sour",
    name: "Amaretto Sour",
    category: "Clássicos Contemporâneos",
    garnish: "Óleos essenciais de limão siciliano",
    method: "Batido / Dupla filtragem",
    glass: "On the Rocks",
    ingredients: [
      {
        name: "Amaretto Del Orso",
        amount: "50",
        unit: "ml",
      },
      {
        name: "Xarope simples",
        amount: "15",
        unit: "ml",
      },
      {
        name: "Sumo de limão siciliano",
        amount: "20",
        unit: "ml",
      },
      {
        name: "Clara de ovo",
        amount: "1",
        unit: "und",
      },
    ],
    preparation: [
      "Resfrie previamente um copo On the Rocks.",
      "Em uma coqueteleira, adicione todos os ingredientes.",
      "Faça um dry shake por 15 a 20 segundos.",
      "Adicione gelo sólido até preencher aproximadamente ⅔ da coqueteleira.",
      "Faça um wet shake por 12 a 15 segundos.",
    ],
    tags: ["amaretto", "sour", "clara", "limão"],
  },

  {
    id: "espresso-martini",
    name: "Espresso Martini",
    category: "Clássicos",
    garnish: "3 grãos de café",
    method: "Batido",
    glass: "Taça Evangeline",
    ingredients: [
      {
        name: "Vodka Wyborowa / Absolut",
        amount: "50",
        unit: "ml",
      },
      {
        name: "Café espresso",
        amount: "30",
        unit: "ml",
        observation: "Cápsula de café espresso",
      },
      {
        name: "Licor de café Cabralab",
        amount: "25",
        unit: "ml",
      },
      {
        name: "Xarope simples",
        amount: "10",
        unit: "ml",
      },
    ],
    preparation: [
      "Na coqueteleira, adicione vodka, café, licor de café e xarope simples.",
      "Adicione gelo sólido até preencher aproximadamente ⅔ da coqueteleira.",
      "Bata por 10 a 12 segundos.",
      "Faça dupla coagem para a taça previamente resfriada.",
      "Finalize com 3 grãos de café.",
    ],
    tags: ["vodka", "café", "espresso", "martini"],
  },

  {
    id: "old-cuban",
    name: "Old Cuban",
    category: "Clássicos",
    garnish: "Folha de hortelã",
    method: "Batido / Top up",
    glass: "Taça Coupe Horizon",
    ingredients: [
      {
        name: "Havana 7 anos",
        amount: "50",
        unit: "ml",
      },
      {
        name: "Sumo de limão tahiti",
        amount: "25",
        unit: "ml",
      },
      {
        name: "Xarope simples",
        amount: "20",
        unit: "ml",
      },
      {
        name: "Folhas de hortelã",
        amount: "8 a 10",
        unit: "und",
      },
      {
        name: "Angostura Bitters",
        amount: "2",
        unit: "dashes",
      },
      {
        name: "Espumante brut",
        amount: "60",
        unit: "ml",
      },
    ],
    preparation: [
      "Torça levemente as folhas de hortelã.",
      "Na coqueteleira, adicione limão, rum, xarope, Angostura e as folhas de hortelã.",
      "Adicione gelo sólido até preencher aproximadamente ⅔ da coqueteleira.",
      "Bata por 8 a 10 segundos.",
      "Faça a dupla filtragem e complete com espumante brut.",
    ],
    tags: ["rum", "hortelã", "espumante", "fresco"],
  },

  {
    id: "autoral-2",
    name: "Autoral 2",
    category: "Autorais",
    garnish: "Amendoim praliné artesanal",
    method: "Mexido",
    glass: "On the Rocks",
    ingredients: [
      {
        name: "Rum envelhecido fatwash óleo de gergelim",
        amount: "50",
        unit: "ml",
      },
      {
        name: "Licor de café",
        amount: "15",
        unit: "ml",
      },
      {
        name: "Extrato clarificado de amendoim",
        amount: "20",
        unit: "ml",
      },
      {
        name: "Tintura de cumaru",
        amount: "2",
        unit: "gotas",
      },
      {
        name: "Solução salina",
        amount: "2",
        unit: "gotas",
      },
    ],
    preparation: [
      "Adicionar os ingredientes ao mixing glass.",
      "Adicionar gelo e mexer.",
      "Coar para o copo On the Rocks.",
      "Finalizar com amendoim praliné artesanal.",
    ],
    tags: ["autoral", "rum", "café", "amendoim", "cumaru"],
  },
];

export const categories = [
  "Todos",
  "Clássicos",
  "Clássicos Contemporâneos",
  "Autorais",
];