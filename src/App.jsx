// src/App.js
import { useRef, useEffect, useState } from 'react';
import { ZIM } from 'zego-zim-web';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import './App.css';

// image
import IMGlogo from './icons/sweely.png'

function App() {
  // --------------------------------------------------
  // EN: Reference to the Zego SDK instance stored in a ref so
  // it can be accessed from event handlers without re-rendering.
  // ID: Referensi instance Zego disimpan di ref agar bisa
  // diakses dari event handler tanpa memicu re-render.
  // JP: Zegoインスタンスをrefに格納し、イベントハンドラから
  // 再レンダリングせずにアクセスできるようにします。
  // --------------------------------------------------
  const zpRef = useRef(null);

  // --------------------------------------------------
  // EN: Local state to hold generated user ID and name.
  // ID: State lokal untuk menyimpan userID dan userName yang di-generate.
  // JP: 生成されたユーザーIDと名前を保持するローカルステート。
  // --------------------------------------------------
  const [user, setUser] = useState({
    userID: '',
    userName: '',
  });

  // ------------------------------------------------------------------
  // EN: useEffect runs once on mount to:
  //  1. generate a demo userID/userName
  //  2. request a test token with `generateKitTokenForTest`
  //  3. create ZegoUIKitPrebuilt instance and add ZIM plugin
  // ID: useEffect dijalankan sekali saat mount untuk:
  //  1. buat userID/userName demo
  //  2. generate token testing dengan `generateKitTokenForTest`
  //  3. buat instance ZegoUIKitPrebuilt dan tambahkan plugin ZIM
  // JP: マウント時に一度だけ実行され、次を行います：
  //  1. デモ用のuserID/userName生成
  //  2. `generateKitTokenForTest`でテストトークン生成
  //  3. ZegoUIKitPrebuiltインスタンスの生成とZIMプラグイン追加
  // ------------------------------------------------------------------
  useEffect(() => {
    // EN: Create a simple random user id and name for demo/test only.
    // ID: Buat userID dan userName random untuk demo/testing saja.
    // JP: デモ/テスト用に簡単なランダムuserIDとuserNameを生成します。
    const userID = 'user' + Math.floor(Math.random() * 1000);
    const userName = 'Test' + userID;
    setUser({ userID, userName });

    // ----------------------------------------------------------------
    // EN: IMPORTANT — generateKitTokenForTest is only for local testing.
    // For production, generate tokens on your server with your appSecret.
    // ID: PENTING — generateKitTokenForTest hanya untuk testing lokal.
    // Di produksi, generate token di server menggunakan server secret.
    // JP: 重要 — `generateKitTokenForTest`はローカルテスト専用です。
    // 本番ではサーバー側でトークンを生成してください。
    // ----------------------------------------------------------------
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      232132132131313, // Xample
      '432432423432432442', //Xample
      'room1', // roomID
      userID,
      userName
    );

    // EN: Create ZegoUIKitPrebuilt instance with the token.
    // ID: Buat instance ZegoUIKitPrebuilt dengan token.
    // JP: トークンを使ってZegoUIKitPrebuiltインスタンスを作成します。
    const zp = ZegoUIKitPrebuilt.create(token);

    // EN: Optionally add plugins such as ZIM for instant messaging.
    // ID: Tambahkan plugin (mis. ZIM) jika butuh fitur messaging.
    // JP: 必要に応じてZIM等のプラグインを追加します。
    zp.addPlugins({ ZIM });

    // Save instance to ref for later use
    zpRef.current = zp;

    // EN: Clean up if the SDK exposes a destroy method.
    // ID: Clean up saat unmount jika SDK punya destroy.
    // JP: SDKがdestroyメソッドを提供している場合、クリーンアップを行います。
    return () => {
      try {
        if (zpRef.current && typeof zpRef.current.destroy === 'function') {
          zpRef.current.destroy();
        }
      } catch (e) {
        // silent fail
      }
    };
  }, []);

  // ------------------------------------------------------------------
  // EN: invite() — send an invitation to a target user.
  // - In this demo, prompts are used to input callee details.
  // - In production, replace with proper forms, validation, and contact list.
  // ID: invite() — mengirim undangan ke target user.
  // - Di demo ini, menggunakan prompt() untuk input target.
  // - Di produksi, ganti dengan form, validasi, dan daftar kontak.
  // JP: invite() — 対象ユーザーに招待を送信します。
  // - このデモではprompt()で入力を受け付けています。
  // - 本番ではフォームやバリデーション、連絡先リストを使用してください。
  // ------------------------------------------------------------------
  const invite = (callType) => {
    const targetUserID = prompt('Masukkan ID Pengguna yang ingin dihubungi');
    const targetUserName = prompt('Masukkan Nama Pengguna yang ingin dihubungi');

    if (targetUserID && targetUserName) {
      zpRef.current.sendCallInvitation({
        callees: [{ userID: targetUserID, userName: targetUserName }],
        callType,
        timeout: 60, // seconds until invitation times out
      }).then((res) => {
        console.warn('Undangan berhasil dikirim:', res);
      }).catch((err) => {
        console.warn('Gagal mengirim undangan:', err);
      });
    }
  };

  // ------------------------------------------------------------------
  // EN: JSX layout
  // - Background video element
  // - Overlay with blur/dim
  // - Card containing logo, user info and action buttons
  // ID: Struktur JSX
  // - Video latar
  // - Overlay blur/gelap
  // - Card dengan logo, info user, dan tombol aksi
  // JP: JSXレイアウト
  // - 背景動画
  // - ぼかし/オーバーレイ
  // - ロゴ、ユーザー情報、ボタンを含むカード
  // ------------------------------------------------------------------
  return (
    <div className="w-full h-screen relative flex items-center justify-center">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/bg.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay biar ada blur/gelap */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm"></div>

      {/* Konten utama */}
      <div className="relative z-10 rounded-lg w-[450px] h-[400px] bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center gap-[20px] shadow-lg">
        <img className="h-[100px]" src={IMGlogo} alt="Logo" />

        <div className="text-center">
          <p className="text-white w-80">
            Ketika ingin melakukan pemanggilan Nama Pengguna dan ID pengguna harus sama
          </p>
          <h2 className="text-[white] text-[20px] mt-2">
            <b><span className="text-red-700">Nama Pengguna:</span></b> {user.userName}
          </h2>
          <h2 className="text-[white] text-[20px]">
            <b><span className="text-red-700">ID Pengguna:</span></b> {user.userID}
          </h2>
        </div>

        <div className="flex space-x-4">
          <button
            className="ml-5 bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-red-700"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)}
          >
            Panggilan Suara
          </button>

          <button
            className="bg-primary border-primary border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-red-700"
            onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}
          >
            Panggilan Video
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;