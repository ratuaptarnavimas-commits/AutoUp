export const vehicleMakes = [
  "Abarth", "Alfa Romeo", "Audi", "BMW", "Chevrolet", "Chrysler", "Citroen", "Cupra", "Dacia", "Daewoo", "Dodge", "Fiat", "Ford", "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Saab", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
].map((makeName) => ({ makeId: makeName.toLowerCase().replace(/[^a-z0-9]+/g, "-"), makeName }));
