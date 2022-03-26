import CustomTable from './core/customTable';
// import data from './data/smallData';
import data from './data/bigData';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<CustomTable data={data} suffix={'test'}></CustomTable>
			</header>
		</div>
	);
}

export default App;
