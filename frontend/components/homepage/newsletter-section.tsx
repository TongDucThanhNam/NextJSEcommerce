"use client";

import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";

export default function NewsletterSection() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/send-newletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("Message sent successfully!");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="text-center mb-8">
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Đăng ký nhận thông tin tư vấn.
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
              Nếu bạn hứng thú với sản phẩm của chúng tôi, hãy để lại Số điện
              thoại để nhận thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất có
              thể.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md gap-x-4"
            >
              <Input
                value={phoneNumber}
                id={"phone-number"}
                type={"tel"}
                placeholder={"0909123456"}
                label={"Số điện thoại"}
                color={"default"}
                onValueChange={(value) => setPhoneNumber(value)}
              />
              <Button
                color={"primary"}
                size={"lg"}
                className={""}
                variant={"shadow"}
                type={"submit"}
              >
                Đăng ký
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
