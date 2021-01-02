import { getTheme } from "../themes/theme";

const theme = getTheme("light");
export const stats = [
  {
    id: "1",
    name: "kg",
    longName: "Kilogram",
    description: "The classic - a scale never lies",
    classifications: function (height = 1.75, male = true) {
      const adjHeight = height > 100 ? height * 0.01 : height;
      const heightSquared = adjHeight * adjHeight;
      return male
        ? [
            {
              name: "Underweight",
              min: 0,
              max: 18.5 * heightSquared,
              color: theme.StatsClassifications.bad,
            },
            {
              name: "Normal weight",
              min: 18.5 * heightSquared,
              max: 25 * heightSquared,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Overweight",
              min: 25 * heightSquared,
              max: 30 * heightSquared,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Obese",
              min: 30 * heightSquared,
              max: 50 * heightSquared,
              color: theme.StatsClassifications.veryBad,
            },
          ]
        : [
            {
              name: "Underweight",
              min: 0 * heightSquared,
              max: 18.5 * heightSquared,
              color: theme.StatsClassifications.bad,
            },
            {
              name: "Normal weight",
              min: 18.5 * heightSquared,
              max: 25 * heightSquared,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Overweight",
              min: 25 * heightSquared,
              max: 30 * heightSquared,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Obese",
              min: 30 * heightSquared,
              max: 50 * heightSquared,
              color: theme.StatsClassifications.veryBad,
            },
          ];
    },
  },
  {
    id: "2",
    name: "Body Fat %",
    longName: "Body Fat Percentage",
    description: "Usually measured with a smart scale or caliper",
    classifications: function (height = 1.75, male = true) {
      return male
        ? [
            {
              name: "Essential Fat",
              min: 2,
              max: 5,
              color: theme.StatsClassifications.veryBad,
            },
            {
              name: "Athlete",
              min: 5,
              max: 13,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Fitness",
              min: 13,
              max: 17,
              color: theme.StatsClassifications.good,
            },
            {
              name: "Average",
              min: 17,
              max: 24,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Obese",
              min: 24,
              max: 100,
              color: theme.StatsClassifications.bad,
            },
          ]
        : [
            {
              name: "Essential Fat",
              min: 1,
              max: 13,
              color: theme.StatsClassifications.veryBad,
            },
            {
              name: "Athlete",
              min: 13,
              max: 20,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Fitness",
              min: 21,
              max: 24,
              color: theme.StatsClassifications.good,
            },
            {
              name: "Average",
              min: 24,
              max: 31,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Obese",
              min: 31,
              max: 100,
              color: theme.StatsClassifications.bad,
            },
          ];
    },
  },
  {
    id: "3",
    name: "BMI",
    longName: "Body Mass Index",
    description:
      "BMI = kg / height². Very simple measure and a common indicator",
    classifications: function (height = 1.75, male = true) {
      return male
        ? [
            {
              name: "Underweight",
              min: 0,
              max: 18.5,
              color: theme.StatsClassifications.bad,
            },
            {
              name: "Normal weight",
              min: 18.5,
              max: 25,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Overweight",
              min: 25,
              max: 30,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Obese",
              min: 30,
              max: 50,
              color: theme.StatsClassifications.veryBad,
            },
          ]
        : [
            {
              name: "Underweight",
              min: 0,
              max: 18.5,
              color: theme.StatsClassifications.bad,
            },
            {
              name: "Normal weight",
              min: 18.5,
              max: 25,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Overweight",
              min: 25,
              max: 30,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Obese",
              min: 30,
              max: 50,
              color: theme.StatsClassifications.veryBad,
            },
          ];
    },
  },

  {
    id: "4",
    name: "FFMI",
    longName: "Fat Free Mass Index",
    description:
      "FFMI = kg * (1 - Body Fat %) / height² + 6.3 * (1.8 - height). More sophisticated measure to account for the Arnold's of this world!",
    classifications: function (height = 1.75, male = true) {
      return male
        ? [
            {
              name: "Skinny guy",
              min: 0,
              max: 18,
              color: theme.StatsClassifications.veryBad,
            },
            {
              name: "Average",
              min: 18,
              max: 20,
              color: theme.StatsClassifications.bad,
            },
            {
              name: "Good Fitness",
              min: 20,
              max: 22,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Very muscular",
              min: 22,
              max: 23.5,
              color: theme.StatsClassifications.good,
            },
            {
              name: "Natural limit",
              min: 23.5,
              max: 25,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Probably Steroids",
              min: 25,
              max: 28,
              color: theme.StatsClassifications.steroids,
            },
          ]
        : [
            {
              name: "Skinny girl",
              min: 0,
              max: 15,
              color: theme.StatsClassifications.veryBad,
            },
            {
              name: "Average",
              min: 15,
              max: 17,
              color: theme.StatsClassifications.bad,
            },
            {
              name: "Good Fitness",
              min: 17,
              max: 18,
              color: theme.StatsClassifications.average,
            },
            {
              name: "Very muscular",
              min: 18,
              max: 19,
              color: theme.StatsClassifications.good,
            },
            {
              name: "Natural limit",
              min: 19,
              max: 20,
              color: theme.StatsClassifications.veryGood,
            },
            {
              name: "Probably Steroids",
              min: 20,
              max: 23,
              color: theme.StatsClassifications.steroids,
            },
          ];
    },
  },
  {
    id: "5",
    name: "Measurement",
    longName: "Body Measurements",
    description:
      "Add a single body measurements as a goal, ie: Chest, Upper arm, Quadriceps, Calf, Waist... Only one measurement per goal to keep focus!",
    classifications: function (height = 1.75, male = true) {
      return null;
    },
  },
];
