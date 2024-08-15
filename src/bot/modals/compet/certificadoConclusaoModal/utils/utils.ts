export function validateDate(date: string): boolean {
    // Regular expressions to match various date formats
    const dateRegex1 = /^\d{2}\/\d{2}\/\d{4}$/;
    const dateRegex2 = /^\d{1}\/\d{2}\/\d{4}$/;
    const dateRegex3 = /^\d{2}\/\d{1}\/\d{4}$/;
    const dateRegex4 = /^\d{1}\/\d{1}\/\d{4}$/;

    // Check if the date matches any of the allowed formats
    if(!dateRegex1.test(date) && !dateRegex2.test(date) && !dateRegex3.test(date) && !dateRegex4.test(date))
        return false;

    // Split the date into day, month, and year
    const parts = date.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Validate day, month, and year ranges
    if(day < 1 || month < 1 || month > 12 || year < 1)
        return false;

    // Days in each month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check for leap year and adjust February days
    if(month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)))
        daysInMonth[1] = 29;

    // Validate the day within the correct month
    if (day > daysInMonth[month - 1]) return false;

    return true;
}

export function turnDateToString(date: string): string {
    const parts = date.split('/');
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${day} de ${monthNames[parseInt(month) - 1]} de ${year}`; 
}

export function validateMinutes(minutes: string): boolean {
    const minutesNumber = parseInt(minutes, 10);
    if(isNaN(minutesNumber)) return false;
    return minutesNumber > 0;
}

export function minutesToString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let hoursString = hours.toString();
    if(onlyOneDigit(hoursString)) hoursString = hoursString.padStart(2, '0');

    let minutesString = remainingMinutes.toString();
    if(onlyOneDigit(minutesString)) minutesString = minutesString.padStart(2, '0');

    if(hours === 0) return `${minutesString} minutos`;
    if(remainingMinutes === 0) return `${hoursString} horas`;
    return `${hoursString} horas e ${minutesString} minutos`;
}

function onlyOneDigit(num: string): boolean {
    return num.length === 1;
}

export function validateName(name: string): boolean {
    name = name.trim();
    if(name.length < 1 || name.length > 100) return false;
    
    // Regular expression to match a valid name
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return nameRegex.test(name);
}

export function getFormattedName(name: string): string {
    name = name.trim();
    return capitalizeFirstLetter(name);
}

function capitalizeFirstLetter(str: string): string {
    const parts = str.split(' ');
    const formattedParts = parts.map(part => {
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return formattedParts.join(' ');
}
