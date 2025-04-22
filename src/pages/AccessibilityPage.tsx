import React from 'react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';

const AccessibilityPage: React.FC = () => {
    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <Helmet>
                <title>Accessibility Statement | Tomer Goldstein Portfolio</title>
                <meta name="description" content="Accessibility statement and information about this website's accessibility features" />
            </Helmet>

            <h1 className="text-4xl font-bold mb-8 text-center">Accessibility Statement</h1>

            <div className="space-y-8 prose dark:prose-invert max-w-none">
                <section>
                    <p className="lead text-lg">
                        This website is designed to be accessible to all users, including those with disabilities.
                        We are committed to ensuring digital accessibility for people with disabilities and are
                        continuously improving the user experience for everyone.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold">Accessibility Coordinator</h2>
                    <p>
                        For any accessibility questions, concerns, or feedback, please contact:
                    </p>
                    <div className="bg-card p-4 rounded-lg my-4">
                        <p><strong>Name:</strong> Tomer Goldstein</p>
                        <p><strong>Email:</strong> <a href="mailto:tomerg.work@gmail.com">tomerg.work@gmail.com</a></p>
                    </div>
                    <p>
                        You can contact our accessibility coordinator for any accessibility-related issue,
                        improvement suggestion, or assistance with using this website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold">Accessibility Features</h2>

                    <h3 className="text-xl font-semibold mt-6">Web Accessibility</h3>
                    <p>
                        We strive to make this portfolio website accessible to all users. Our focus is on
                        providing an equal experience regardless of abilities or disabilities.
                    </p>
                    <p>
                        At the top of the website is an accessibility menu that allows you to modify the display
                        settings and navigate more easily. These tools are available on every page of the website.
                    </p>

                    <h3 className="text-xl font-semibold mt-6">Non-text Content</h3>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>All images have alternative text (alt) describing the image</li>
                        <li>Images that function as links have descriptive text explaining their purpose</li>
                        <li>In high contrast modes, distracting images and banners are removed</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6">Structure and Relationships</h3>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Semantic HTML code with consistent H1 headings on each page</li>
                        <li>Information is organized in a logical, easy-to-follow structure</li>
                        <li>The page is divided into regions for easier keyboard navigation with the Tab key</li>
                        <li>Full separation of content and presentation using CSS</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6">Color and Contrast</h3>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>You can change the site's contrast in two levels: high contrast and very high contrast (yellow text on black background)</li>
                        <li>Colors have been adjusted to reduce visual stimulation, and certain banners are disabled in these versions</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6">Text Size and Screen Size</h3>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Enlarging the page to 200% will not affect the visibility of information</li>
                        <li>In contrast versions, the site automatically appears 25% larger than its original size</li>
                        <li>The accessibility menu offers three types of enlargements, but you can also use keyboard functions:</li>
                    </ul>
                    <div className="bg-card p-4 rounded-lg my-4">
                        <ul className="list-disc ml-6 space-y-2">
                            <li><kbd>Ctrl</kbd> + <kbd>+</kbd> will increase the text size</li>
                            <li><kbd>Ctrl</kbd> + <kbd>-</kbd> will decrease the text size</li>
                            <li><kbd>Ctrl</kbd> + <kbd>0</kbd> will return the site to its original size</li>
                            <li><kbd>Space</kbd> will scroll the page down</li>
                            <li><kbd>F11</kbd> will maximize the screen - pressing again will reduce it back</li>
                        </ul>
                    </div>

                    <h3 className="text-xl font-semibold mt-6">Keyboard Navigation</h3>
                    <p>
                        The site supports keyboard navigation using the <kbd>Tab</kbd> key, arrow keys, and pressing <kbd>Enter</kbd>
                        to activate various links.
                    </p>

                    <h3 className="text-xl font-semibold mt-6">Additional Notes</h3>
                    <p>
                        In accessibility versions, all flashing elements have been removed and hidden to prevent issues for sensitive
                        users. We've tried to make these versions comfortable and without features that might interfere with the
                        browsing experience.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold">Compliance Status</h2>
                    <p>
                        This website strives to conform to Web Content Accessibility Guidelines (WCAG) 2.1,
                        Level AA standards. We are continuously working to improve accessibility and usability
                        for all users.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold">Feedback</h2>
                    <p>
                        We welcome your feedback on the accessibility of this website. Please let us know
                        if you encounter any accessibility barriers or have suggestions for improvement.
                    </p>
                    <p>
                        You can contact us through the <a href="/contact" className="text-primary hover:underline">Contact Page</a>
                        or directly email our accessibility coordinator at <a href="mailto:tomerg.work@gmail.com" className="text-primary hover:underline">tomerg.work@gmail.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AccessibilityPage; 