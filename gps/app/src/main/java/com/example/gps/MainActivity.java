package com.example.gps;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.os.Bundle;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.text.Html;
import android.util.Log;
import android.view.View;

import androidx.core.app.ActivityCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.gps.databinding.ActivityMainBinding;

import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.TextView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.xml.namespace.QName;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration appBarConfiguration;
    private ActivityMainBinding binding;
    public class Store {
        private String name;
        private double store_longitude;
        private double store_latitude;
        private String city;

        public Store(String name, double store_longitude, double store_latitude, String city){
            this.name = name;
            this.store_latitude = store_latitude;
            this.store_longitude = store_longitude;
            this.city = city;
        }
    }

    // initialize variables
    Button btLocation, closeStores;
    TextView textView1, textView2, textView3, textView4, textView5, textView6;
    FusedLocationProviderClient fusedLocationProviderClient;
    double currentLongitude, currentLatitude;
    String currentCity;
    List<Store> stores = new ArrayList<Store>();
    Store coffee_time = new Store("coffee time", 34.84361, 32.06853, "רמת גן");
    Store b605 = new Store("605 building", 34.84340, 32.07044, "רמת גן");
    Store b504 = new Store("504 building", 34.84437, 32.06974, "רמת גן");
    Store Aroma = new Store("Aroma", 34.84554, 32.06811, "רמת גן");
    Store superPharm = new Store("Super Pharm", 34.8545, 32.07734, "גבעת שמואל");


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        System.out.println("before if");
        // Assign variable
        btLocation = findViewById(R.id.bt_location);
        closeStores = findViewById(R.id.bt_close_stores);
        textView1 = findViewById(R.id.text_view1);
        textView2 = findViewById(R.id.text_view2);
        textView3 = findViewById(R.id.text_view3);
        textView4 = findViewById(R.id.text_view4);
        textView5 = findViewById(R.id.text_view5);
        textView6 = findViewById(R.id.text_view6);
        stores.add(coffee_time);
        stores.add(b605);
        stores.add(b504);
        stores.add(Aroma);
        stores.add(superPharm);

        // Initialize fusedLocationProviderClient
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);

        btLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Check Permission
                System.out.println("check permission");
                if (ActivityCompat.checkSelfPermission(MainActivity.this,
                        Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    // When permission granted
                    System.out.println("permission");
                    getLocation();
                } else {
                    // When permission denied
                    ActivityCompat.requestPermissions(MainActivity.this
                            , new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 44);
                    System.out.println("denied");
                    //getLocation();

                }
            }
        });

        closeStores.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String cities_to_print = "";
                System.out.println("before for");
                for (Store s: stores){
                    System.out.println("inside for");
                    if (s.city.equals(currentCity)){
                        if ((Math.abs(currentLongitude - s.store_longitude) < 0.001) &&
                                (Math.abs(currentLatitude - s.store_latitude) < 0.001)){
                            cities_to_print+=s.name;
                            cities_to_print+="<br/>";
                            System.out.println(cities_to_print);
                        }
                    }
                }
                if (!cities_to_print.equals("")){
                    textView6.setText(Html.fromHtml("<font color = '#6200EE'><b>"+cities_to_print+"</b><br></font>"));
                }
                else {
                    textView6.setText(Html.fromHtml("<font color = '#6200EE'><b>I am not close to any store</b><br></font>"));
                }
            }
        });
    }

    private void getLocation() {
        System.out.println("before if");
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        fusedLocationProviderClient.getLastLocation().addOnCompleteListener(new OnCompleteListener<Location>() {
            @Override
            public void onComplete(@NonNull Task<Location> task) {
                // Initialize Location
                System.out.println("on complete");
                Location location = task.getResult();

                System.out.println("location: "+task.getException());
                System.out.println("after get result");
                //                         currentLatitude = addresses.get(0).getLatitude();
//                         currentLongitude = addresses.get(0).getLongitude();
                if (location != null) {
                    try {
                        System.out.println("not null");

                        // Initialize geoCoder
                        Geocoder geocoder = new Geocoder(MainActivity.this,
                                Locale.getDefault());
                        List<Address> addresses = geocoder.getFromLocation(
                                location.getLatitude(), location.getLongitude(), 1);
                        // Set latitude on TextView
                        textView1.setText(
                                Html.fromHtml("<font color = '#6200EE'><b>Latitude :</b><br></font>"
                                        + addresses.get(0).getLatitude()));
                        currentLatitude = addresses.get(0).getLatitude();

                        // Set longitude on TextView
                        textView2.setText(
                                Html.fromHtml("<font color = '#6200EE'><b>Longitude :</b><br></font>"
                                        + addresses.get(0).getLongitude()));
                        currentLongitude = addresses.get(0).getLongitude();

                        // set country name
                        textView3.setText(
                                Html.fromHtml("<font color = '#6200EE'><b>Country Name :</b><br></font>"
                                        + addresses.get(0).getCountryName()));
                        // set locality
                        textView4.setText(
                                Html.fromHtml("<font color = '#6200EE'><b>Locality :</b><br></font>"
                                        + addresses.get(0).getLocality()));
                        currentCity = addresses.get(0).getLocality();
                        // set address
                        textView5.setText(
                                Html.fromHtml("<font color = '#6200EE'><b>Address :</b><br></font>"
                                        + addresses.get(0).getAddressLine(0)));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

//        binding = ActivityMainBinding.inflate(getLayoutInflater());
//        setContentView(binding.getRoot());
//
//        setSupportActionBar(binding.toolbar);
//
//        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
//        appBarConfiguration = new AppBarConfiguration.Builder(navController.getGraph()).build();
//        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
//
//        binding.fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();
//            }
//        });


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }
}