import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (email === "admin@gmail.com" && password === "admin") {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login_name: email, password }),
            })
            const data: any = await response.json();
            const { token, statusCode, message = "" } = data;
            if (statusCode === 200) {
                localStorage.setItem("authToken", token);
                localStorage.setItem("userData", JSON.stringify(data));
                navigate("/roles");
            } else {
                setError(message);
            }
        } else {
            const response = await fetch("http://localhost:3000/api/auth/login-by-role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login_name: email, password }),
            })
            const data: any = await response.json();
            const { token, statusCode, message = "" } = data;
            if (statusCode === 200) {
                localStorage.setItem("authToken", token);
                localStorage.setItem("userData", JSON.stringify(data));
                navigate("/trained-data");
            } else {
                setError(message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-[100vw]">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full" onClick={handleLogin}>
                        Sign in
                    </Button>
                    {/* <p className="text-sm text-gray-500">
                        Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
                    </p> */}
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
