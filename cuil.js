document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('form#form');
	const dni = document.querySelector('input#dni');
	const sugestionContainer = document.querySelector('ul#sugestions');

	let li, sugestions;

	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			sugestions = generateCuitSuggestions(dni.value);

			if (sugestions.length <= 0) {
				sugestionContainer.innerHTML = '';
				li = document.createElement('li');
				li.innerText = `No hay sugerencias`;
				sugestionContainer.appendChild(li);
			} else {
				if (sugestionContainer.childNodes.length > 0) {
					sugestionContainer.innerHTML = '';
				}
				sugestions.forEach((el) => {
					li = document.createElement('li');
					li.innerText = `${el}`;
					sugestionContainer.appendChild(li);
				});
			}
		});
	}

	/**
	 * Generate CUIT suggestions
	 *
	 * @param {number} dni - DNI number
	 *
	 * @returns {array} - List of CUIT suggestions
	 */
	function generateCuitSuggestions(dni) {
		const genders = [
			{
				description: 'persona física',
				id: 20,
				gender: 'masculino',
			},
			{
				description: 'persona física',
				id: 23,
				gender: '',
			},
			{
				description: 'persona física',
				id: 24,
				gender: '',
			},
			{
				description: 'persona física',
				id: 25,
				gender: '',
			},
			{
				description: 'persona física',
				id: 26,
				gender: '',
			},
			{
				description: 'persona física',
				id: 27,
				gender: 'femenino',
			},
			{
				description: 'persona jurídica',
				id: 30,
				gender: 'empresa',
			},
			{
				description: 'persona jurídica',
				id: 33,
				gender: 'empresa',
			},
			{
				description: 'persona jurídica',
				id: 34,
				gender: 'empresa',
			},
		];
		const validCuitLength = 11;
		let results = [];
		try {
			if (!validDni(dni)) {
				throw new Error('Invalid DNI');
			}
			genders.forEach((gender) => {
				const cuit = generateCuit(gender.id, dni);
				if (cuit && cuit.length <= validCuitLength) {
					const genderDescription = gender.description.toUpperCase();
					results.push(`${cuit} - ${genderDescription}`);
				}
			});
		} catch (error) {
			results = [];
			console.error(error.message || 'Something wrong happened');
		}
		results = [...new Set(results)];
		return results;
	}

	/**
	 * Generate CUIL number
	 *
	 * @param {number} gender - Gender identification number
	 * @param {number} dni - DNI number
	 *
	 * @returns {string} - CUIL number
	 */
	function generateCuit(gender, dni) {
		if (
			Number(gender) === NaN ||
			Number(dni) === NaN ||
			gender <= 0 ||
			dni <= 0
		) {
			throw new Error('Parameters must be integers and bigger than 0');
		}
		const mult = calcMult(gender, dni);
		const num = sumAllNums(mult);
		const rest = calcRest(num);
		const { gen, ver } = calcVerification(gender, rest);
		let dniStr = String(dni);
		if (dniStr.length === 7) {
			dniStr = `0${dniStr}`;
		}
		return [gen, dniStr, ver].join('');
	}

	/**
	 * Check if DNI is valid
	 *
	 * @param {number} dni - DNI number
	 *
	 * @returns {boolean} - True if DNI is valid, false otherwise
	 */
	function validDni(dni) {
		// * DNI could have 7 or 8 digits
		const minlen = 7;
		const maxlen = 8;
		const str = String(dni).trim();
		const dniLen = str.split('').length;
		if (str === '' || dniLen < minlen || dniLen > maxlen || dni <= 0) {
			return false;
		}
		return true;
	}

	/**
	 * Calculate verification number
	 *
	 * @param {number} gender - Gender identification number
	 * @param {number} rest - Rest of the sum of all numbers
	 *
	 * @returns {obj} - gender and verification number
	 */
	function calcVerification(gender, rest) {
		if (Number(gender) === NaN || Number(rest) === NaN) {
			throw new Error('Parameters must be integers');
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

	/**
	 * Calculate the rest of the sum of all numbers
	 *
	 * @param {number} num - Number to calculate the rest
	 *
	 * @returns {number} - Rest of the sum of all numbers
	 */
	function calcRest(num) {
		if (Number(num) === NaN || num <= 0) {
			throw new Error('Parameter must be an integer and bigger than 0');
		}
		let rest;
		const factor = 11;
		let div = num / factor;
		// ? round accordingly. it could give different or incorrect results
		/* if (div % 1 >= 0.5) {
      div = Math.ceil(div);
    } else {
      div = Math.floor(div);
    } */
		div = Math.floor(div);
		const op = div * factor;
		if (num >= op) {
			rest = num - op;
		} else {
			rest = op - num;
		}
		return rest;
	}

	/**
	 * Sum all numbers
	 *
	 * @param {string} nums - List of numbers separated by comma
	 *
	 * @returns {number} - Sum of all numbers
	 */
	function sumAllNums(nums) {
		if (String(nums).trim() === '') {
			throw new Error('Parameter must be a valid list of numbers');
		}
		const numList = nums.split(',').map(Number);
		return numList.reduce((prev, curr) => prev + curr, 0);
	}

	/**
	 * Calculate multiplication
	 *
	 * @param {number} gender - Gender identification number
	 * @param {number} dni - DNI number
	 *
	 * @returns {string} - List of numbers separated by comma
	 */
	function calcMult(gender, dni) {
		if (
			Number(gender) === NaN ||
			Number(dni) === NaN ||
			gender <= 0 ||
			dni <= 0
		) {
			throw new Error('Parameters must be integers and bigger than 0');
		}
		const NUMS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
		const g = String(gender).split('');
		const d = String(dni).split('');
		if (dni.length === 7) {
			d.unshift('0');
		}
		const merged = [...g, ...d].map(Number);
		const mult = merged.reduce(
			(prev, curr, i) => [prev, curr * NUMS[i]].join(','),
			[]
		);
		return mult.substring(1);
	}
});
