exports.predictDiscount = (priceHistory) => {

  if (!priceHistory || priceHistory.length < 3) {

    return {
      prediction: "Not enough data",
      confidence: "Low"
    };

  }

  return {

    prediction: "Possible discount in 7 days",
    confidence: "65%"

  };

};