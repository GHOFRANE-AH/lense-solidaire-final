function PriceResult({ price }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      {price ? (
        <h3>Prix estimé : {price} €</h3>
      ) : (
        <p>Envoyez une photo pour obtenir une estimation.</p>
      )}
    </div>
  );
}

export default PriceResult;
