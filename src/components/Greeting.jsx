const Greeting = () => {
  const curretDate = new Date();
  const currentHour = curretDate.getHours();

  let greeting;

  if (currentHour < 12) {
    greeting = "Buenos días";
  } else if (currentHour < 18) {
    greeting = "Buenas tardes";
  } else {
    greeting = "Buenas noches";
  }

  return <h1 className="text-5xl font-bold text-white">{greeting}</h1>;
};

export default Greeting;
