// 1. Функция sum принимает параметром целые положительные
// числа (неопределённое кол-во) и возвращает их сумму (rest).

export function sum(...nums: Array<number>): number {
  let total = 0;
  for (const arg of nums) {
    total += arg;
  }
  return total;
}

// 2. Функция getTriangleType принимает три параметра:
// длины сторон треугольника.
// Функция должна возвращать:
//  - "10", если треугольник равносторонний,
//  - "01", если треугольник равнобедренный,
//  - "11", если треугольник обычный,
//  - "00", если такого треугольника не существует.

export function getTriangleType(a: number, b: number, c: number): string {
  if (a + b <= c || a + c <= b || c + b <= a) {
    return "00";
  }
  if (a === b && a === c) {
    return "10";
  }
  if (a === b || b === c || a === c) {
    return "01";
  }

  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return "11";
}

// 3. Функция getSum принимает параметром целое число и возвращает
// сумму цифр этого числа

export function getSum(number: number): number {
  let sum: number = 0;
  while (number >= 0) {
    let rest = number % 10;
    number = (number - rest) / 10;
    sum += rest;
  }
  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return sum;
}

// 4. Функция isEvenIndexSumGreater принимает  параметром массив чисел.
// Если сумма чисел с чётными ИНДЕКСАМИ!!! (0 как чётный индекс) больше
// суммы чисел с нечётными ИНДЕКСАМИ!!!, то функция возвращает true.
// В противном случае - false.

export const isEvenIndexSumGreater = (arr: Array<number>): boolean => {
  let a = 0;
  let b = 0;
  for (let i = 0; i < arr.length; i = i + 2) {
    a = a + arr[i];
  }
  for (let i = 1; i < arr.length; i = i + 2) {
    b = b + arr[i];
  }
  if (a > b) {
    return true;
  }
  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return false;
};

// 5. Функция getSquarePositiveIntegers принимает параметром массив чисел и возвращает новый массив.
// Новый массив состоит из квадратов целых положительных чисел, котрые являются элементами исходгого массива.
// Исходный массив не мутирует.

export function getSquarePositiveIntegers(array: Array<number>): Array<number> {
  let a: number[] = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] > 0 && Number.isInteger(array[i])) {
      a.push(array[i] * array[i]);
    }
  }

  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return a;
}

// 6. Функция принимает параметром целое не отрицательное число N и возвращает сумму всех чисел от 0 до N включительно
// Попробуйте реализовать функцию без использования перебирающих методов.

export function sumFirstNumbers(N: number): number {
  let total = 0;
  for (let i = 1; i < N + 1; i++) {
    total = total + i;
  }
  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return total;
}

// ...и "лапку" вверх!!!!

// Д.З.:
// 7. Функция-банкомат принимает параметром целое натуральное число (сумму).
// Возвращает массив с наименьшим количеством купюр, которыми можно выдать эту
// сумму. Доступны банкноты следующих номиналов:
// const banknotes = [1000, 500, 100, 50, 20, 10, 5, 2, 1].
// Считаем, что количество банкнот каждого номинала не ограничено

export function getBanknoteList(amountOfMoney: number): Array<number> {
  const banknotes = [1000, 500, 100, 50, 20, 10, 5, 2, 1];
  const a: Array<number> = [];
  let aa = 0;
  while (amountOfMoney > 0) {
    aa = amountOfMoney % banknotes[0];
    if ((aa = 0)) {
      banknotes.shift();
    } else {
      amountOfMoney = amountOfMoney - aa * banknotes[0];

      for (let i = 1; i < aa + 1; i++) {
        a.push(banknotes[0]);
      }
      banknotes.shift();
    }
  }
  //...здесь пишем код.
  // В return стоит "заглушка", чтоб typescript не ругался
  return a;
}
