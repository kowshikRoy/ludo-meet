export default function TermsOfService() {
  return (
    <div className="max-w-2xl mx-auto p-8 prose">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>
        By installing and using the Ludo Meet Google Meet Add-on, you agree to be bound by these Terms of Service.
      </p>
      
      <h2>2. Use License</h2>
      <p>
        This add-on is free to use for personal and commercial meetings within Google Meet. You may not reverse engineer, decompile, or attempt to extract the source code of the add-on.
      </p>
      
      <h2>3. Disclaimer</h2>
      <p>
        The software is provided "as is", without warranty of any kind. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement.
      </p>
      
      <h2>4. Limitations</h2>
      <p>
        In no event shall Ludo Meet or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the add-on.
      </p>
    </div>
  );
}
