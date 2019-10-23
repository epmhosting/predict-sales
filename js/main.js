async function predictSales() {

  const url = 'https://automodel.rapidminer.com/am/api/deployments/1e085afc-11f9-4361-87a4-8ccbf12059ef';

  const proposal = getProposal();

  if (proposal.error) {
    return proposal
  };

  const data = {
    "data": [proposal]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    const json = await response.json();
    return json
  } catch (error) {
    console.log(error.message);
    return {
      error: true,
      message: "Error: Unable to get prediction."
    }
  }
}

function displayResponse(response) {

  const output = document.querySelector('#output');

  if (response.error) {
    output.innerText = response.message;
  } else {
    const data = response.data[0];

    const sales = Math.round(data["prediction(Sales)"] * 100) / 100;

    output.innerHTML = `Predicted sales generated for advertising $${data.TV * 1000} on TV, $${data.Radio * 1000} on radio and $${data.Newspaper * 1000} on newspaper is <strong>${sales}</strong> (thousands of units)`;
  }
}

function getProposal() {

  const tv = document.querySelector('#tv-input').value;
  const radio = document.querySelector('#radio-input').value;
  const newspaper = document.querySelector('#newspaper-input').value;

  if ((tv < 0) || (radio < 0) || (newspaper < 0)) {
    return {
      error: true,
      message: "Error: All advertising budgets cannot be less than $0"
    }
  } else {
    return {
      "TV": tv,
      "Radio": radio,
      "Newspaper": newspaper
    };
  }

}

function displayClear() {
  document.querySelector('#output').innerHTML = '';
}

document.querySelector('#submitBtn').addEventListener('click', async (e) => {

  const ele = e.target;

  ele.disabled = true;
  ele.innerText = 'Running..';
  displayClear();

  const response = await predictSales();
  console.log(JSON.stringify(response, null, 2))
  
  ele.innerText = 'Submit';
  ele.disabled = false;
  displayResponse(response);

})