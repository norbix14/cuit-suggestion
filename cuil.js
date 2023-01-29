document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form#form");
  const dni = document.querySelector("input#dni");
  const sugestionContainer = document.querySelector("ul#sugestions");
  let li, sugestions;
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sugestions = cuil(dni.value);
      if (sugestions.length <= 0) {
        sugestionContainer.innerHTML = "";
        li = document.createElement("li");
        li.innerText = `No hay sugerencias`;
        sugestionContainer.appendChild(li);
      } else {
        if (sugestionContainer.childNodes.length > 0) {
          sugestionContainer.innerHTML = "";
        }
        sugestions.forEach((el) => {
          li = document.createElement("li");
          li.innerText = `${el}`;
          sugestionContainer.appendChild(li);
        });
      }
    });
  }
  function cuil(dni) {
    const genders = [20, 23, 24, 27, 30];
    let results = [];
    try {
      if (!validDni(dni)) {
        throw new Error("Invalid DNI");
      }
      genders.forEach((gender) => {
        results.push(generateCuil(gender, dni));
      });
    } catch (error) {
      results = [];
      console.error(error.message || "Something wrong happened");
    }
    results = [...new Set(results)];
    return results;
  }
  function generateCuil(gender, dni) {
    if (
      Number(gender) === NaN ||
      Number(dni) === NaN ||
      gender <= 0 ||
      dni <= 0
    ) {
      throw new Error("Parameters must be integers and bigger than 0");
    }
    const mult = calcMult(gender, dni);
    const num = sumAllNums(mult);
    const rest = calcRest(num);
    const { gen, ver } = calcVerification(gender, rest);
    return [gen, dni, ver].join("");
  }
  function validDni(dni) {
    const len = 8;
    const str = String(dni).trim();
    const dniLen = str.split("").length;
    if (str === "" || dniLen < len || dniLen > len || dni <= 0) {
      return false;
    }
    return true;
  }
  function calcVerification(gender, rest) {
    if (Number(gender) === NaN || Number(rest) === NaN) {
      throw new Error("Parameters must be integers");
    }
    const factor = 11;
    let z = factor - rest;
    let g = gender;
    if (rest === 0) {
      z = 0;
    }
    if (rest === 1) {
      if (gender === 20) {
        z = 9;
        g = 23;
      }
      if (gender === 27) {
        z = 4;
        g = 23;
      }
    }
    return { gen: g, ver: z };
  }
  function calcRest(num) {
    if (Number(num) === NaN || num <= 0) {
      throw new Error("Parameter must be an integer and bigger than 0");
    }
    let rest;
    const factor = 11;
    const div = Math.floor(num / factor);
    const op = div * factor;
    if (num >= op) {
      rest = num - op;
    } else {
      rest = op - num;
    }
    return rest;
  }
  function sumAllNums(nums) {
    if (String(nums).trim() === "") {
      throw new Error("Parameter must be a valid list of numbers");
    }
    const numList = nums.split(",").map(Number);
    return numList.reduce((prev, curr) => prev + curr, 0);
  }
  function calcMult(gender, dni) {
    if (
      Number(gender) === NaN ||
      Number(dni) === NaN ||
      gender <= 0 ||
      dni <= 0
    ) {
      throw new Error("Parameters must be integers and bigger than 0");
    }
    const NUMS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const g = String(gender).split("");
    const d = String(dni).split("");
    const merged = [...g, ...d].map(Number);
    const mult = merged.reduce(
      (prev, curr, i) => [prev, curr * NUMS[i]].join(","),
      []
    );
    return mult.substring(1);
  }
});
