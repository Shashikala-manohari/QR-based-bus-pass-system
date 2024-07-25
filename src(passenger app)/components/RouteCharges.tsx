import {Alert} from 'react-native';

const HandlePay = async (
  pickupPoint: string,
  dropedPoint: string,
) => {
  const Route = [
    {chargeRate: 0, charge: 0},
    {chargeRate: 1, charge: 30},
    {chargeRate: 2, charge: 38},
    {chargeRate: 3, charge: 50},
    {chargeRate: 4, charge: 61},
    {chargeRate: 5, charge: 73},
    {chargeRate: 6, charge: 84},
    {chargeRate: 7, charge: 96},
    {chargeRate: 8, charge: 99},
    {chargeRate: 9, charge: 107},
    {chargeRate: 10, charge: 115},
    {chargeRate: 11, charge: 122},
    {chargeRate: 12, charge: 128},
    {chargeRate: 13, charge: 136},
    {chargeRate: 14, charge: 143},
    {chargeRate: 15, charge: 149},
    {chargeRate: 16, charge: 155},
    {chargeRate: 17, charge: 163},
    {chargeRate: 18, charge: 168},
    {chargeRate: 19, charge: 176},
    {chargeRate: 20, charge: 182},
    {chargeRate: 21, charge: 189},
    {chargeRate: 22, charge: 195},
    {chargeRate: 23, charge: 203},
    {chargeRate: 24, charge: 209},
    {chargeRate: 25, charge: 216},
    {chargeRate: 26, charge: 222},
    {chargeRate: 27, charge: 230},
    {chargeRate: 28, charge: 235},
    {chargeRate: 29, charge: 243},
    {chargeRate: 30, charge: 251},
    {chargeRate: 31, charge: 256},
    {chargeRate: 32, charge: 264},
    {chargeRate: 33, charge: 270},
    {chargeRate: 34, charge: 277},
    {chargeRate: 35, charge: 283},
    {chargeRate: 36, charge: 291},
    {chargeRate: 37, charge: 297},
    {chargeRate: 38, charge: 304},
    {chargeRate: 39, charge: 310},
    {chargeRate: 40, charge: 318},
    {chargeRate: 41, charge: 323},
    {chargeRate: 42, charge: 331},
    {chargeRate: 43, charge: 337},
    {chargeRate: 44, charge: 344},
    {chargeRate: 45, charge: 350},
    {chargeRate: 46, charge: 358},
    {chargeRate: 47, charge: 364},
    {chargeRate: 48, charge: 371},
  ];

  const pickup = parseInt(pickupPoint.split('_')[0]);
  const drop = parseInt(dropedPoint.split('_')[0]);
  const chargeRate = Math.abs(drop - pickup);
  const charge = Route.find(item => item.chargeRate == chargeRate)?.charge ?? 0;


  

  return charge;
};

export default HandlePay;
