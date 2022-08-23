import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../store/Auth.provider";
import Dashboard from "../Dashboard";
import Login from "../Login";
import Register from "../Register";
import { store } from "../../store/Auth.store";
import { Provider } from "react-redux";
interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (
	props: React.PropsWithChildren<IAppProps>
) => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<AuthProvider>
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
