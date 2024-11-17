import { AuthencationService } from 'src/app/services/authencation.service';
import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collectionData,
  DocumentReference,
  FieldValue,
  CollectionReference,
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  docSnapshots,
  docData,
  getDoc,
  getDocs,
  query,
  where,
  collectionSnapshots,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { ContactRequest } from '../structures/user.structure';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from 'firebase/storage';
import { Product } from '../structures/method.structure';
import {
  DocumentSnapshot,
  endAt,
  increment,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { DataProvider } from '../providers/data.provider';
import { Booking, Guest } from '../structures/booking.structure';
import { Room } from '../structures/rooms.structure';
import { Order } from '../structures/orders.structure';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  contactDoc: CollectionReference;
  feedbackDoc: CollectionReference;
  cartCollectionRef: CollectionReference;
  productCollectionRef: CollectionReference;
  deliveryAddressRef: CollectionReference;
  cartItemDocumentRef: DocumentReference;
  roomCollRef: CollectionReference;
  checkoutCollRef: CollectionReference;
  public id: any;
  storage = getStorage();
  constructor(
    private fs: Firestore,
    private AuthService: AuthencationService,
    private dataProvider: DataProvider
  ) {
    AuthService.getUser.subscribe((res) => {
      //console.log("data", res);
      this.id = res?.uid;
    });
    //this.id = this.dataProvider.userData;
    this.contactDoc = collection(this.fs, 'contactRequests');
    this.feedbackDoc = collection(this.fs, 'feedbacks');
  }
  addContactRequest(
    name: string,
    email: string,
    phoneNumber: string,
    message: string
  ) {
    let data: ContactRequest = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      message: message,
      date: new Date(),
    };
    addDoc(this.contactDoc, data).then((doc) => {
      console.log(doc);
      console.log(doc.id);
    });
  }

  getCartObservable() {
    //console.log("this.id",this.id)
    return collectionSnapshots(
      collection(this.fs, 'users/' + this.id + '/cart')
    );
  }
  getCart() {
    return getDocs(collection(this.fs, 'users/' + this.id + '/cart'));
  }
  async addToCart(data: any) {
    this.cartCollectionRef = collection(this.fs, 'users/' + this.id + '/cart');
    let returnResponse: any;
    let res = await this.getCart();
    console.log('Response', res);
    let found = false;
    let productUpdateId: string = '';
    let alreadyHaveQuantity: any = '';
    res.forEach((cartData: any) => {
      if (cartData.data().productid === data.productid) {
        found = true;
        productUpdateId = cartData.id;
        alreadyHaveQuantity = cartData.data().quantity;
      }
    });
    if (found) {
      console.log('Found', data);
      console.log(productUpdateId);
      return updateDoc(
        doc(this.fs, 'users/' + this.id + '/cart/' + productUpdateId),
        {
          quantity: alreadyHaveQuantity + data.quantity,
        }
      ).catch((err: any) => {
        console.log(err);
      });
    } else {
      console.log('Not found', data);
      return addDoc(this.cartCollectionRef, data);
    }
  }
  deleteCartProduct(id: string) {
    return deleteDoc(doc(this.fs, 'users/' + this.id + '/cart/' + id));
  }
  getDeliveryAddress() {
    //console.log("this.id",this.id)
    return collectionSnapshots(
      collection(this.fs, 'users/' + this.id + '/delivery_addresses')
    );
  }
  addDeliveryAddress(data: any) {
    this.deliveryAddressRef = collection(
      this.fs,
      'users/' + this.id + '/delivery_addresses'
    );
    return addDoc(this.deliveryAddressRef, data);
  }
  deleteDeliveryAddress(id: string) {
    return deleteDoc(
      doc(this.fs, 'users/' + this.id + '/delivery_addresses/' + id)
    );
  }
  getSpecificDeliveryAddress(id: string) {
    return getDoc(
      doc(this.fs, 'users/' + this.id + '/delivery_addresses/' + id)
    );
  }
  async addProduct(data: Product) {
    return addDoc(collection(this.fs, 'products'), data).then((document) => {
      return updateDoc(doc(this.fs, 'products/' + document.id), {
        id: document.id,
      });
    });
    //console.log(q)
  }
  deleteProduct(id: string) {
    return deleteDoc(doc(this.fs, 'products/' + id));
  }
  // async addRoom(data: Product) {
  //   return addDoc(collection(this.fs, 'rooms'), data).then((document) => {
  //     return updateDoc(doc(this.fs, 'rooms/' + document.id), {
  //       id: document.id,
  //     });
  //   });
  //   //console.log(q)
  // }
  getRoomsForAdminPanel() {
    return getDocs(collection(this.fs, 'rooms/'));
  }

  getRooms() {
    return collectionSnapshots(collection(this.fs, 'rooms/'));
  }

  updateCart(id, quantity) {
    //console.log(id,quantity, this.id)
    return updateDoc(doc(this.fs, 'users/' + this.id + '/cart/' + id), {
      quantity: quantity,
    }).catch((err: any) => {
      console.log(err);
    });
  }
  async emptyCart() {
    return await getDocs(
      collection(this.fs, 'users/' + this.id + '/cart')
    ).then((res: any) => {
      res.forEach(async (cartData: any) => {
        return await deleteDoc(
          doc(this.fs, 'users/' + this.id + '/cart/' + cartData.id)
        );
      });
    });
  }
  getVendors() {
    return getDocs(
      query(collection(this.fs, 'users'), where('access', '==', 'Vendor'))
    );
  }
  getCategories() {
    return docData(doc(this.fs, 'siteData/category'));
  }
  getSingleCategories() {
    return getDoc(doc(this.fs, 'siteData/category'));
  }
  addCategory(name: string) {
    return setDoc(
      doc(this.fs, 'siteData/category'),
      { category: arrayUnion(name) },
      { merge: true }
    );
  }
  deleteCategory(name: string) {
    return setDoc(
      doc(this.fs, 'siteData/category'),
      { category: arrayRemove(name) },
      { merge: true }
    );
  }
  getProducts() {
    return collectionSnapshots(collection(this.fs, 'products'));
  }
  getOccupiedRooms() {
    return getDoc(doc(this.fs, 'siteData/rooms'));
  }
  occupyRoom(roomNumber: string) {
    return setDoc(
      doc(this.fs, 'siteData/rooms'),
      { occupiedRooms: arrayUnion(roomNumber) },
      { merge: true }
    );
  }
  async upload(path: string, file: File | null): Promise<any> {
    const ext = file!.name.split('.').pop();
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (e: any) {
        console.error(e);
        return false;
      }
    } else {
      // handle invalid file
      return false;
    }
  }
  addCommentById(id: string, data: any) {
    this.roomCollRef = collection(this.fs, 'rooms/' + id + '/comments');
    return addDoc(this.roomCollRef, data);
  }
  getCommentsOfRoom(id: string) {
    //console.log("this.id",this.id)
    return collectionSnapshots(
      collection(this.fs, 'rooms/' + id + '/comments')
    );
  }
  // CHECKOUT ORDERS ADD UPDATE Functions
  addCheckoutData(data: any) {
    console.log('addCheckoutData');
    this.checkoutCollRef = collection(this.fs, 'users/' + this.id + '/orders');
    return addDoc(this.checkoutCollRef, data);
  }
  addFeedback(name: string, email: string, comment: string) {
    let data: any = {
      name: name,
      email: email,
      message: comment,
      date: new Date(),
    };
    addDoc(this.feedbackDoc, data).then((doc) => {
      console.log(doc);
      console.log(doc.id);
    });
  }
  getFeedbacks() {
    return collectionSnapshots(collection(this.fs, 'feedbacks'));
  }
  async getProductsByCategory(category: string) {
    let q = query(
      collection(this.fs, 'products'),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  getOrders() {
    return getDocs(collection(this.fs, 'users/' + this.id + '/orders'));
  }
  getUsers() {
    return getDocs(collection(this.fs, 'users'));
  }
  getOrderForUser(uid) {
    return getDocs(collection(this.fs, 'users/' + uid + '/orders'));
  }
  async getCustomersListAdmin() {
    let q = query(collection(this.fs, 'users'), where('access', '==', 'User'));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }
  getContactReq() {
    return getDocs(collection(this.fs, 'contactRequests/'));
  }
  getRoomData(id) {
    return getDoc(doc(this.fs, 'rooms/' + id));
  }
  async updateRoom(data: Product) {
    return updateDoc(doc(this.fs, 'rooms/' + data.id), data);
    //console.log(q)
  }

  getCounters() {
    return getDoc(doc(this.fs, 'siteData/counters'));
  }

  getFirstStock(length: number) {
    return getDocs(
      query(collection(this.fs, 'stock'), orderBy('name'), limit(length))
    );
  }

  async getUnits() {
    const data = await getDoc(doc(this.fs, 'siteData/units'));
    if (data.exists()) {
      return data.data()?.['units'].sort();
    } else {
      return [];
    }
  }

  getNextStock(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'stock'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousStock(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'stock'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  updateStockItem(stockId: string, stock: any) {
    return updateDoc(doc(this.fs, 'stock/' + stockId), stock);
  }

  async addStockItem(stockItem: any) {
    try {
      await addDoc(collection(this.fs, 'stock'), stockItem);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        stockLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  async deleteStockItem(stockId: string) {
    try {
      await deleteDoc(doc(this.fs, 'stock/' + stockId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        stockLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getRecipeTypes() {
    return getDocs(query(collection(this.fs, 'categories'), orderBy('name')));
  }

  getAllRecipes() {
    return getDocs(query(collection(this.fs, 'products'), orderBy('name')));
  }

  getFirstRecipes(length: number) {
    return getDocs(
      query(collection(this.fs, 'products'), orderBy('name'), limit(length))
    );
  }

  getNextRecipes(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'products'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousRecipes(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'products'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  async addRecipe(recipe: any) {
    try {
      await addDoc(collection(this.fs, 'products'), recipe);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        recipeLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editRecipe(recipeId: string, recipe: any) {
    return updateDoc(doc(this.fs, 'products/' + recipeId), recipe);
  }

  async deleteRecipe(recipeId: string) {
    try {
      await deleteDoc(doc(this.fs, 'products/' + recipeId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        recipeLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getRecipe(recipeId: any) {
    return getDoc(doc(this.fs, 'products/' + recipeId));
  }

  // Booking Functions
  addBooking(booking: any) {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      totalBookings: increment(1),
    });
    return addDoc(collection(this.fs, 'bookings'), booking);
  }

  getAllBookings() {
    return getDocs(
      query(collection(this.fs, 'bookings'), orderBy('checkInTime', 'desc'))
    );
  }

  getFirstBookings(length: number) {
    return getDocs(
      query(
        collection(this.fs, 'bookings'),
        orderBy('checkInTime', 'desc'),
        limit(length)
      )
    );
  }

  getNextBookings(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'bookings'),
        orderBy('checkInTime', 'desc'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousBookings(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'bookings'),
        orderBy('checkInTime', 'desc'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  async getBookingsInRange(
    from: Timestamp,
    to?: Timestamp
  ): Promise<Booking[]> {
    var bookings: Booking[] = [];

    // First get those bookings after 'from'
    await getDocs(
      query(collection(this.fs, 'bookings'), where('checkInTime', '>=', from))
    ).then((bookingDocs) => {
      bookingDocs.forEach((bookingDoc) => {
        bookings.push(bookingDoc.data() as Booking);
      });
    });

    if (to) {
      // Firebase only allows to filter with an inequality (<, <=, >, or >=) on a single field
      // So we need to manually filter on 'to'
      // Get those bookings before 'to'
      bookings = bookings.filter((booking) => {
        return (
          !booking.checkOutTime || booking.checkOutTime.toDate() <= to.toDate()
        );
      });
    }
    return bookings;
  }

  editBooking(bookingId: string, booking: Booking) {
    return updateDoc(doc(this.fs, 'bookings/' + bookingId), booking);
  }

  deleteBooking(bookingId: string) {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      totalBookings: increment(-1),
    });
    return deleteDoc(doc(this.fs, 'bookings/' + bookingId));
  }

  // Guest Functions

  addGuest(guest: Guest) {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      totalGuests: increment(1),
    });
    return addDoc(collection(this.fs, 'guests'), guest);
  }

  getFirstGuests(length: number) {
    return getDocs(
      query(collection(this.fs, 'guests'), orderBy('name'), limit(length))
    );
  }
  getAllGuests() {
    return getDocs(query(collection(this.fs, 'guests'), orderBy('name')));
  }

  getNextGuests(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'guests'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousGuests(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'guests'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  editGuest(guestId: string, guest: Guest) {
    return updateDoc(doc(this.fs, 'guests/' + guestId), guest);
  }

  deleteGuest(guestId: string) {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      totalGuests: increment(-1),
    });
    return deleteDoc(doc(this.fs, 'guests/' + guestId));
  }
  // Room Functions
  addRoom(room: Room) {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      totalRooms: increment(1),
    });
    return addDoc(collection(this.fs, 'rooms'), room);
  }

  getAllRooms() {
    return getDocs(query(collection(this.fs, 'rooms'), orderBy('number')));
  }

  async getAvailableRooms(from: Timestamp, to?: Timestamp) {
    const rooms = {};
    await this.getAllRooms().then((docs) => {
      docs.forEach((doc) => {
        rooms[doc.id] = { roomId: doc.id, ...doc.data() };
      });
    });

    const bookings = await this.getBookingsInRange(from, to);
    bookings.forEach((booking) => {
      delete rooms[booking.roomId];
    });

    return Object.values(rooms);
  }

  getBookedRooms() {
    // return getDocs(
    //   query(
    //     collection(this.fs, 'rooms'),
    //     orderBy('number'),
    //     where('available', '==', false)
    //   )
    // );
  }

  getFirstRooms(length: number) {
    return getDocs(
      query(collection(this.fs, 'rooms'), orderBy('number'), limit(length))
    );
  }

  getNextRooms(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'rooms'),
        orderBy('number'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousRooms(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'rooms'),
        orderBy('number'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  editRoom(roomId: string, room: Room) {
    return updateDoc(doc(this.fs, 'rooms/' + roomId), room);
  }

  async deleteRoom(roomId: string) {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      totalRooms: increment(-1),
    });
    return deleteDoc(doc(this.fs, 'rooms/' + roomId));
  }
  // Order Functions

  addOrder(Order: Order) {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      pendingOrders: increment(1),
    });
    return addDoc(collection(this.fs, 'orders'), Order);
  }

  getPendingOrders() {
    return getDocs(
      query(
        collection(this.fs, 'orders'),
        orderBy('time'),
        where('status', '==', 'Pending')
      )
    );
  }

  getFirstCompletedOrders(length: number) {
    return getDocs(
      query(
        collection(this.fs, 'orders'),
        orderBy('time'),
        where('status', '==', 'Completed'),
        limit(length)
      )
    );
  }

  getFirstCancelledOrders(length: number) {
    return getDocs(
      query(
        collection(this.fs, 'orders'),
        orderBy('time'),
        where('status', '==', 'Cancelled'),
        limit(length)
      )
    );
  }

  getFirstOrders(length: number) {
    return getDocs(
      query(collection(this.fs, 'orders'), orderBy('time'), limit(length))
    );
  }

  getNextOrders(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'orders'),
        orderBy('time'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousOrders(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'orders'),
        orderBy('time'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  editOrderStatus(orderId: string, status: 'Completed' | 'Cancelled') {
    updateDoc(doc(this.fs, 'siteData/counters'), {
      pendingOrders: increment(-1),
      completedOrders: increment(status === 'Completed' ? 1 : 0),
      cancelledOrders: increment(status === 'Cancelled' ? 1 : 0),
    });
    return updateDoc(doc(this.fs, 'orders/' + orderId), { status: status });
  }

  getOrder(orderId: string) {
    return getDoc(doc(this.fs, 'orders/' + orderId));
  }

  async deleteOrder(orderId: string) {
    const order = (await this.getOrder(orderId)).data();
    if (order) {
      updateDoc(doc(this.fs, 'siteData/counters'), {
        pendingOrders: increment(order.status === 'Pending' ? -1 : 0),
        completedOrders: increment(order.status === 'Completed' ? -1 : 0),
        cancelledOrders: increment(order.status === 'Cancelled' ? -1 : 0),
      });
    }
    return deleteDoc(doc(this.fs, 'orders/' + orderId));
  }

  // Get Dish
  getDish(dishId: string) {
    return getDoc(doc(this.fs, 'products/' + dishId));
  }

  // Get Room
  getRoom(roomId: string) {
    return getDoc(doc(this.fs, 'rooms/' + roomId));
  }

  // Get Guest
  getGuest(guestId: string) {
    return getDoc(doc(this.fs, 'guests/' + guestId));
  }

  getGuestByPhone(phone: string) {
    return getDocs(
      query(
        collection(this.fs, 'guests'),
        where('phoneNumber', '==', phone),
        limit(1)
      )
    );
  }

  // get room types
  getRoomTypes() {
    return getDoc(doc(this.fs, 'siteData/roomTypes'));
  }

  // Get the guest of a room on a certain timestamp
  getRoomGuest(roomId: string, timestamp: Timestamp) {
    // First get those bookings in which the check-in time is before the time asked
    return getDocs(
      query(
        collection(this.fs, 'bookings'),
        where('roomId', '==', roomId),
        where('checkInTime', '<=', timestamp)
      )
    ).then((docs) => {
      // Firebase only allows to filter with an inequality (<, <=, >, or >=) on a single field
      // So we need to manually filter on the check-out time
      // Return the booking whose check-out time is after the time asked
      var guestId = '';
      docs.forEach((doc) => {
        const booking = doc.data();
        if (booking.checkOutTime.toDate() >= timestamp.toDate()) {
          guestId = booking.guestId;
        }
      });
      return this.getGuest(guestId);
    });
  }
  async assignBooking(bookingId: string, roomId: string, userId: string) {
    try {
      await updateDoc(doc(this.fs, 'bookings/' + bookingId), {
        roomId: roomId,
        userId: userId,
      });
      await updateDoc(doc(this.fs, 'rooms/' + roomId), { status: 'Occupied' });
      return await updateDoc(doc(this.fs, 'guests/' + userId), {
        status: 'Occupied',
        roomId: roomId,
        bookingId: bookingId,
      });
    } catch (error) {
      return error;
    }
  }
  getFirstUtilities(length: number) {
    // alert('Getting first utility')
    return getDocs(
      query(collection(this.fs, 'utilities'), orderBy('name'), limit(length))
    );
  }

  getNextUtilities(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next utilities')
    return getDocs(
      query(
        collection(this.fs, 'utilities'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousUtilities(length: number, firstDocument: DocumentSnapshot) {
    // alert('Getting previous utilities')
    return getDocs(
      query(
        collection(this.fs, 'utilities'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }
  getEmployees() {
    // alert('Getting employees')
    return getDocs(query(collection(this.fs, 'employees'), orderBy('name')));
  }
  async addUtility(utility: any) {
    // alert('Adding utility')
    try {
      await addDoc(collection(this.fs, 'utilities'), utility);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        utilityLength: increment(1),
      });
    } catch (e: any) {
      // console.error(e);
      throw new Error(e.toString());
    }
  }

  updateUtility(utilityId: string, utility: any) {
    // alert('Updating utility')
    return updateDoc(doc(this.fs, 'utilities/' + utilityId), utility);
  }
  getSiteData() {
    // alert('Getting site data')
    return getDoc(doc(this.fs, 'siteData/counters'));
  }
  async deleteUtility(utilityId: string) {
    // alert('Deleting utility')
    try {
      await deleteDoc(doc(this.fs, 'utilities/' + utilityId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        utilityLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }
  async addEmployee(employee: any) {
    // alert('Adding employee')
    try {
      await addDoc(collection(this.fs, 'employees'), employee);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        employeeLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editEmployee(employeeId: string, employee: any) {
    // alert('Editing employee')
    return updateDoc(doc(this.fs, 'employees/' + employeeId), employee);
  }

  getEmployee(employeeId: string) {
    // alert('Getting employee')
    return getDoc(doc(this.fs, 'employees/' + employeeId));
  }

  async deleteEmployee(employeeId: string) {
    // alert('Deleting employee')
    try {
      await deleteDoc(doc(this.fs, 'employees/' + employeeId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        employeeLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }
  // Utility management starts
  getUtilities() {
    return getDocs(collection(this.fs, 'stockUtilities'));
  }
  // Utility management ends
}
