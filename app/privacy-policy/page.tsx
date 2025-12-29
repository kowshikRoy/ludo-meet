export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto p-8 prose">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        Ludo Meet ("we", "our", or "us") is a Google Meet Add-on designed to allow users to play Ludo within a meeting.
        This Privacy Policy explains how we collect, use, and share information about you when you use our add-on.
      </p>
      
      <h2>1. Information We Collect</h2>
      <p>
        We collect minimal information necessary to provide the game functionality:
      </p>
      <ul>
        <li><strong>Game State:</strong> Temporary data about piece positions and turn status to synchronize the game between players.</li>
        <li><strong>Participant IDs:</strong> Obfuscated identifiers provided by Google Meet to distinguish players.</li>
      </ul>
      
      <h2>2. How We Use Information</h2>
      <p>
        We use the information solely to:
      </p>
      <ul>
        <li>Maintain the synchronization of the Ludo game session.</li>
        <li>Identify turns and winners.</li>
      </ul>
      <p>We do not store this data permanently. All game data is ephemeral and discarded once the meeting or session ends.</p>
      
      <h2>3. Data Sharing</h2>
      <p>
        We do not share your personal data with third parties. Game state is broadcasted only to other participants in your specific Google Meet meeting via the Google Meet Add-ons SDK.
      </p>
      
      <h2>4. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at [Your Support Email].
      </p>
    </div>
  );
}
