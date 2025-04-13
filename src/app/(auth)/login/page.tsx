"use client";

import ClientOnly from "@/components/ClientOnly";
import { CustomerError } from "@/lib/shopify/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FormData } from "../sign-up/page";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setErrorMessages([]);
        const data = responseData;
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/");
      } else {
        const errors = responseData.errors || [];
        setErrorMessages(errors);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="h3 mb-6 text-center">Login</h1>
      {errorMessages?.length > 0 && (
        <div className="mb-4">
          {errorMessages.map((error: CustomerError, index) => (
            <p key={index} className="text-red-500">
              {error.message}
            </p>
          ))}
        </div>
      )}
      <div className="rounded bg-theme-light p-8 text-center dark:bg-darkmode-theme-light">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-8 w-full"
            disabled={loading}
          >
            {loading ? (
              <BiLoaderAlt className="m-auto animate-spin" size={24} />
            ) : (
              "Login"
            )}
          </button>
          <p className="mt-6">
            New Customer?{" "}
            <Link href="/sign-up" className="text-primary">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <ClientOnly>
      <LoginForm />
    </ClientOnly>
  );
};

export default Login;
