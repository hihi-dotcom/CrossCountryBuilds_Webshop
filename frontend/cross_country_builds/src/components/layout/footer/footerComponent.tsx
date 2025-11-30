import './footer.css'

export function Footer() {
  return (
    <footer>
      <div className="footersection">
        <div className="cim">
          <h2 className="cimcimsor">Címünk: </h2>
          <p>1025 Budapest Futrinka utca 28.</p>
        </div>
        <div className="elerhetoseg">
          <h2 className="elerhcimsor">Elérhetőségeink: </h2>
          <p>
            :info@menokerekparbolt.hu
          </p>
          <p>
            :06 1 3345678
          </p>
        </div>
      </div>
    </footer>
  );
}