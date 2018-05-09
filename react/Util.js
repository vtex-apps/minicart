/**
 * It will convert an integer to float moving the
 * float point two positions left.
 *
 * The OrderForm REST API return an integer
 * colapsing the floating point into the integer
 * part.
 *
 * @param number An integer number
 */
export function convertIntToFloat(number) {
  return number * 0.01
}
