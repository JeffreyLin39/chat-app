// React
import * as React from "react";
// React router
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Context
import { AuthProvider } from "../../store/Auth.provider";
import { store } from "../../store/Auth.store";
import { Provider } from "react-redux";
// Components
import Dashboard from "../Dashboard";
import Login from "../Login";
import Register from "../Register";
import Chat from "../Chat";
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
						<Route path="/chat/:id" element={<Chat />} />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
