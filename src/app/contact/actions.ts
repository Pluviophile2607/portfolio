"use server";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaxOjbJuxc9wPKMnAB-s0KytQOeX_XMO2P8LJTdb5XKyM6G06uSQ5uss-3NQg6tDnD/exec";

export async function submitContactForm(data: any) {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });

    return { success: true };
  } catch (error: any) {
    console.error("[Contact] Server Action Error:", error?.message || error);
    return { success: false, error: String(error) };
  }
}
