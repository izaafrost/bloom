/* ─────────────────────────────────────────────────────────────
   Bloom – konfiguration af baggrunds-notifikationer (Web Push)

   Udfyld disse to felter EFTER du har deployet push-serveren
   (se mappen /server og dens README).

   • serverUrl       = den fulde adresse på din deployede server,
                       fx "https://bloom-push.onrender.com"
                       (uden skråstreg til sidst)
   • vapidPublicKey  = den OFFENTLIGE VAPID-nøgle (samme som på serveren)

   Lader du serverUrl stå tom, bruger appen kun lokale påmindelser
   (vises mens appen er åben). Det er helt fint at starte sådan.
   ───────────────────────────────────────────────────────────── */
window.BLOOM_CONFIG = {
  serverUrl: "",
  vapidPublicKey: "BC63yKPjySC6KOfkUwl3h_p2Lbtn35NnQ4wFsaJsNAWPdFiLybtlsr48QJn5g192Z4Lms_xKsOFllmdd7YzMsVU"
};
