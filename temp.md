Udemy
Microservices with Node JS and React
Required MongoMemoryServer Updates
In the upcoming lecture, we will be setting up our test environment with MongoMemoryServer. If you are using the latest versions of this library a few changes will be required:

In auth/src/test/setup.ts, change these lines:

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
to this:

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();


Remove the useNewUrlParser and useUnifiedTopology parameters from the connect method. Change this:

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
to this:

  await mongoose.connect(mongoUri, {});


Then, find the afterAll hook and add a conditional check:

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});


Lastly, find the beforeEach hook and add a conditional check:

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
 
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});


For reference:

https://nodkz.github.io/mongodb-memory-server/docs/guides/migration/migrate7/https://nodkz.github.io/mongodb-memory-server/docs/guides/migration/migrate7/




Play
167. Fundamental Authentication Strategies
9min
Play
168. Huge Issues with Authentication Strategies
8min
Play
169. So Which Option?
3min
Play
170. Solving Issues with Option #2
8min
Play
171. Reminder on Cookies vs JWT's
6min
Play
172. Microservices Auth Requirements
11min
Play
173. Issues with JWT's and Server Side Rendering
10min
Play
174. Cookies and Encryption
5min
Play
175. Adding Session Support
3min
Play
176. Generating a JWT
8min
Play
177. JWT Signing Keys
5min
Play
178. Securely Storing Secrets with Kubernetes
2min
Play
179. Creating and Accessing Secrets
9min
Play
180. Accessing Env Variables in a Pod
5min
Play
181. Common Response Properties
5min
Play
182. Formatting JSON Properties
11min
Play
183. The Signin Flow
8min
Play
184. Common Request Validation Middleware
6min
Play
185. Sign In Logic
7min
Play
186. Quick Sign In Test
2min
Play
187. Current User Handler
3min
Play
188. Returning the Current User
9min
Play
189. Signing Out
3min
Play
190. Creating a Current User Middleware
7min
Play
191. Augmenting Type Definitions
8min
Play
192. Requiring Auth for Route Access
8min
Play
193. Scope of Testing
4min
Play
194. Testing Goals
5min
Play
195. Testing Architecture
8min
Play
196. Index to App Refactor
3min
Start
197. Replacing --only=prod Install Flag
1min
Play
198. A Few Dependencies
4min
Start
199. Required MongoMemoryServer Updates
1min
Play
200. Test Environment Setup
8min
Play
201. Our First Test
6min
Play
202. An Important Note
2min
Play
203. Testing Invalid Input
5min
Play
204. Requiring Unique Emails
2min
Play
205. Changing Node Env During Tests
6min
Play
206. Tests Around Sign In Functionality
6min
Start
207. Cookie Request is Possibly Undefined Error
1min
Play
208. Testing Sign Out
5min
Play
209. Issues with Cookies During Testing
5min
Start
210. No Overload Matches This Call Error with Cookie
1min
Play
211. Easy Auth Solution
3min
Start
212. globalThis has no index signature TS Error
1min
Play
213. Auth Helper Function
7min
Play
214. Testing Non-Authed Requests
2min




















































Teach the world online
Create an online video course, reach students across the globe, and earn money
Top companies choose Udemy Business to build in-demand career skills.
NasdaqVolkswagenBoxNetAppEventbrite
Udemy Business
Teach on Udemy
Get the app
About us
Contact us
Careers
Blog
Help and Support
Affiliate
Investors
Terms
Privacy policy
Sitemap
Accessibility statement
© 2025 Udemy, Inc.
