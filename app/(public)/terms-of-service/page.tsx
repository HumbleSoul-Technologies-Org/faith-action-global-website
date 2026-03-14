import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Faith Action Global ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily access the materials (information or software) on Faith Action Global's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on our website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Content</h2>
            <p className="text-muted-foreground mb-4">
              Our website may allow you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post to the website, including its legality, reliability, and appropriateness.
            </p>
            <p className="text-muted-foreground mb-4">
              By posting Content to the website, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">
              You may not use our website:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">
              The website and its original content, features, and functionality are and will remain the exclusive property of Faith Action Global and its licensors. The website is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account and bar access to the website immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p className="text-muted-foreground mb-4">
              If you wish to terminate your account, you may simply discontinue using the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, Faith Action Global:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-4">
              <li>Excludes all representations and warranties relating to this website and its contents</li>
              <li>Does not guarantee that the website will be constantly available, or available at all</li>
              <li>Does not warrant that the results that may be obtained from the use of the website will be accurate or reliable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitations</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Faith Action Global or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the website, even if Faith Action Global or a Faith Action Global authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Accuracy of Materials</h2>
            <p className="text-muted-foreground mb-4">
              The materials appearing on Faith Action Global's website could include technical, typographical, or photographic errors. Faith Action Global does not warrant that any of the materials on its website are accurate, complete, or current. Faith Action Global may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of [Your State/Country], and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p>Email: legal@faithactionglobal.org</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Faith Street, Hope City, ST 12345</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}