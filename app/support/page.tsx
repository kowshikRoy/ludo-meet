export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 prose">
      <h1>Ludo Meet Support</h1>
      <p>
        If you are experiencing any issues with Ludo Meet or have any questions, we are here to help!
      </p>
      
      <h2>Contact Us</h2>
      <p>
        For support inquiries, please email us at: <a href="mailto:support@ludo-meet.com">support@ludo-meet.com</a>
        {/* Replace with your actual support email or helpdesk link */}
      </p>

      <h2>Frequently Asked Questions</h2>
      
      <h3>The "Start New Game" button is disabled.</h3>
      <p>
        Make sure you are running the add-on within Google Meet. This add-on requires the Google Meet environment to function.
      </p>

      <h3>My game piece won't move.</h3>
      <p>
        Ensure it is your turn (your color will be highlighted) and that you have rolled a valid move. You need a 6 to move a piece out of the base.
      </p>
    </div>
  );
}
