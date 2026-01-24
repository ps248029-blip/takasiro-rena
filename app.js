// Python（Colab）側のAPIのURL（CloudflareのURLを毎回ここだけ更新）
const API_BASE = "https://tennessee-lease-firewire-quantitative.trycloudflare.com";

// ページが読み込まれてから実行
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#reservationForm");
  if (!form) return; // フォームが無いページでは何もしない

  // フォーム送信時の処理
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // 通常の送信を止める

    // 支払方法チェック
    const paymentEl = document.querySelector('input[name="payment"]:checked');
    if (!paymentEl) {
      alert("支払方法を選択してください");
      return;
    }

    // 希望時間（reservation.html に id="time" がある前提）
    const timeEl = document.querySelector("#time");
    if (!timeEl || !timeEl.value) {
      alert("希望時間を選択してください");
      return;
    }

    // 入力値をまとめる
    const data = {
      name: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      date: document.querySelector("#date").value,
      time: timeEl.value,
      payment: paymentEl.value,
      message: document.querySelector("#message").value || "",
    };

    try {
      // Python（Colab）のAPIへ送信
      const res = await fetch(API_BASE + "/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.ok) {
        // 成功したら完了ページへ
        window.location.href = "reservation-done.html";
      } else {
        // サーバー側の理由を出す（超大事：原因が分かる）
        alert(json.detail || "予約に失敗しました");
      }
    } catch (error) {
      alert("通信に失敗しました。Colabが起動しているか確認してください。");
      console.error(error);
    }
  });
});
