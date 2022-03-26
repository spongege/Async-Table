import CustomTable from './customTable';
import data from './data';

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
